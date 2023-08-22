// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Arpa3 is Ownable, ReentrancyGuard {
    
    IERC20 public immutable arpa3Token;
   
    enum  WorkflowStatus { UserRecording, RecordPrivilege, VoteSessionStart, VoteSessionEnd }
    WorkflowStatus public workflowstatus;
    uint public counter;
    uint public number;
    uint public amountpriv = 500000000000000000;
    uint public votingSessionNumber;
    uint private winningProposalID;
    uint public rewardAmount = 5;

    struct Privilege{
        uint idP;
        uint amount;
        string description;
        uint nbVote;
        bool isActive;
    }

    Privilege[] privilegeArray;
    
    struct Proposal {
        address addresse;
        string name;
        string firstname;
        string service;
        uint nbvote;
    }

    Proposal[] public proposalArray;

    struct Profil {
        string name;
        string firstname;
        uint nbVotePrivilege;
        bool hasvoted;
        bool active;
    }

    struct Orders {
        address winnerAddress;
        uint privilegeID;
        string descprivi;
        uint timestamprivi;
        uint amountprivi;
        bool consoprivi;
    }

    Orders[] public ordersArray;

    mapping(address => Profil) public users;
    mapping(address=>uint) balances;

    event AddProfil(address _address, string _name, string _firstname);
    event AddPrivilege(address _address, string _description);
    event GetWinnerSession(uint _session, address _adresse, uint _nbVote);
    event HistoricVote(uint _session, address _adresse, string motivation);
    event GetWinnerToken(address _address, uint _amount);
    event BuyToken(address _address, uint _amount, uint _indexp);

    constructor(address _rewardToken) {
        arpa3Token = IERC20(_rewardToken);
    }

    function addPrivilege(string calldata _description) external payable nonReentrant{
        require(users[msg.sender].active == true,"User not recorded");
        require(msg.value == amountpriv, "Incorrect amount");
        
        Privilege memory privilege;
        privilege.idP = counter;
        privilege.amount = 0;
        privilege.description = _description;
        privilege.isActive = false;
        privilegeArray.push(privilege);

        balances[msg.sender] += msg.value;
        ++counter;
        emit AddPrivilege(msg.sender, _description);
    }

    function addPrivilegePrice(uint _idp,uint _amount) external onlyOwner{
        privilegeArray[_idp].amount = _amount;
    }

    function getPrivilege() external view returns(Privilege[] memory){
        return privilegeArray;
    }

    function buyPrivilege(uint _indexp,uint _amount) external {
        require(_amount > 0, "Not correct price");
        require(arpa3Token.balanceOf(msg.sender) >= _amount,"Not enought funds to buy this privilege");
        require(privilegeArray[_indexp].amount == _amount,"Petit malin va ...");

        require(arpa3Token.transferFrom(msg.sender,address(this), _amount * 10**18),"Transfer erreur");

        Orders memory orders;
        orders.winnerAddress = msg.sender;
        orders.privilegeID = _indexp;
        orders.timestamprivi = block.timestamp;
        orders.amountprivi = _amount;
        orders.consoprivi = false;
        ordersArray.push(orders);
        
        
        emit BuyToken(msg.sender, _amount, _indexp);
    }

    function getOrders() external view returns(Orders[] memory){
        return ordersArray;
    }

    function approveArpacoin(uint _amount) external {
        arpa3Token.approve(msg.sender, _amount* 10**18);
    }



    /// @notice Check if user is recorded on chain / Address and Proposal 
    function isAccountExist(address _address) external view returns(bool){
        return users[_address].active;
    }

    /// @notice Record profil user and record proposal
    /// @notice each users can be proposal
    function setProfilAndProposal(string calldata _name, string calldata _firstname, string calldata _service) external {
        require(msg.sender != address(0), "not connected");
        require(!users[msg.sender].active, "Account already Exist");
        require( bytes(_name).length > 0 && bytes(_firstname).length > 0 && bytes(_service).length > 0, "Value not empty");
        // struct profil
        users[msg.sender].name = _name;
        users[msg.sender].firstname = _firstname;
        users[msg.sender].hasvoted = false;
        users[msg.sender].active = true;

        // Array Proposal
        Proposal memory proposal;
        proposal.addresse = msg.sender;
        proposal.name = _name;
        proposal.firstname = _firstname;
        proposal.service = _service;
        proposal.nbvote = 0; 
        proposalArray.push(proposal);

        emit AddProfil(msg.sender, _name,  _firstname);
    }

    function hasVoted() external view returns(bool){
        return users[msg.sender].hasvoted;
    }

    function setVote(uint _id, string calldata _motivation) external {
        require(workflowstatus == WorkflowStatus.VoteSessionStart, 'Voting session havent started yet');
        require(!users[msg.sender].hasvoted, 'You have already voted');
        require(_id < proposalArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        users[msg.sender].hasvoted = true;
        proposalArray[_id].nbvote++;

        // if this vote has more votes than the winner vote
        if(proposalArray[_id].nbvote > proposalArray[winningProposalID].nbvote) {
            winningProposalID = _id;
        }
        emit HistoricVote(votingSessionNumber, proposalArray[_id].addresse, _motivation);
    }

    /// @notice Display the winner and clean data for next session
    /// @dev send Token to winner
    function stopVoteSession() external onlyOwner{
        workflowstatus = WorkflowStatus.VoteSessionEnd;
        _sendToken(proposalArray[winningProposalID].addresse);
    }

    function getWinner() external view returns(Proposal memory){
        require(workflowstatus == WorkflowStatus.VoteSessionEnd,"Session Vote not closed");
        return proposalArray[winningProposalID];
    }

    function startVoteSession() external onlyOwner{
        ++votingSessionNumber;
        workflowstatus = WorkflowStatus.VoteSessionStart;
        for (uint256 index = 0; index < proposalArray.length; ++index) {
            proposalArray[index].nbvote = 0;
            users[proposalArray[index].addresse].hasvoted = false;
        }
    }

    function getProposal() external view returns(Proposal[] memory){
        return proposalArray;
    }

    function setWorkflowstatus(WorkflowStatus _step) external onlyOwner{
        workflowstatus = _step;
    }

    function getMyBalanceDep() external view returns(uint){
        return balances[msg.sender];
    }

    function getMyEthBalance() external view returns(uint){
        return msg.sender.balance;
    }

    function _sendToken(address _addresse) private nonReentrant {
        require(_addresse != address(0), "not valid account");
        require(proposalArray[winningProposalID].addresse == _addresse, "You are not the Winner Session vote");
        arpa3Token.transfer(_addresse, rewardAmount * 10**18);
        emit GetWinnerToken(_addresse, rewardAmount);
    }

    function setRewardAmount(uint _amount) external onlyOwner{
        rewardAmount = _amount;
    }

    function getArpaTokenBalance() external view returns(uint){
        return arpa3Token.balanceOf(msg.sender);
    }

    function getBalanceSC() external view returns(uint){
        return arpa3Token.balanceOf(address(this));
    }

    fallback() external payable {}
    receive() external payable {}

}