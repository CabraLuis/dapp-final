// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address[] public owners; // Cuentas dueñas capaces de aprobar transacciones
    uint public requiredApprovals; // Mínimo requerido de aprobaciones
    mapping(address => bool) public isOwner; // Registro de cuentas de dueños

    struct StructTransaction {
        address to;
        uint amount; // Cantidad en wei (0.00000---01 ether)
        uint approvalCount; // Cuántas aprobaciones tiene la transacción
        bool executed;
    }

    StructTransaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approvals;

    // Eventos para monitorear actividad
    event Deposit(address indexed sender, uint amount, uint contractBalance);
    event TransactionSubmitted(
        uint indexed transactionId,
        address indexed to,
        uint amount
    );
    event TransactionApproved(
        uint indexed transactionId,
        address indexed approver
    );
    event TransactionExecuted(
        uint indexed transactionId,
        address indexed executor
    );

    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(_owners.length > 0, "Debe haber al menos un owner");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _owners.length,
            "Numero invalido de aprobaciones requeridas"
        );

        for (uint i = 0; i < _owners.length; i++) {
            require(_owners[i] != address(0), "Owner invalido");
            require(!isOwner[_owners[i]], "Owner duplicado");
            isOwner[_owners[i]] = true;
        }

        owners = _owners;
        requiredApprovals = _requiredApprovals;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "No es un owner");
        _;
    }

    modifier transactionExists(uint _transactionId) {
        require(_transactionId < transactions.length, "Transaccion no existe");
        _;
    }

    modifier notExecuted(uint _transactionId) {
        require(
            !transactions[_transactionId].executed,
            "Transaccion ya ejecutada"
        );
        _;
    }

    modifier notApproved(uint _transactionId) {
        require(
            !approvals[_transactionId][msg.sender],
            "Transaccion ya aprobada"
        );
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Debes enviar Ether");
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(address _to, uint _amount) public onlyOwner {
        require(_to != address(0), "Direccion invalida");
        require(_amount > 0, "Cantidad debe ser mayor a 0");

        transactions.push(
            StructTransaction({
                to: _to,
                amount: _amount,
                approvalCount: 0,
                executed: false
            })
        );
        emit TransactionSubmitted(transactions.length - 1, _to, _amount);
    }

    function approveTransaction(
        uint _transactionId
    )
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
        notApproved(_transactionId)
    {
        StructTransaction storage transaction = transactions[_transactionId];
        approvals[_transactionId][msg.sender] = true;
        transaction.approvalCount += 1;

        emit TransactionApproved(_transactionId, msg.sender);
    }

    function executeTransaction(
        uint _transactionId
    )
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
    {
        StructTransaction storage transaction = transactions[_transactionId];
        require(
            transaction.approvalCount >= requiredApprovals,
            "No suficientes aprobaciones"
        );

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.amount}("");
        require(success, "Transferencia fallida");

        emit TransactionExecuted(_transactionId, msg.sender);
    }

    function getTransactions()
        public
        view
        returns (StructTransaction[] memory)
    {
        return transactions;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionDetails(
        uint _transactionId
    )
        public
        view
        transactionExists(_transactionId)
        returns (address to, uint amount, uint approvalCount, bool executed)
    {
        StructTransaction memory transaction = transactions[_transactionId];
        return (
            transaction.to,
            transaction.amount,
            transaction.approvalCount,
            transaction.executed
        );
    }
}
