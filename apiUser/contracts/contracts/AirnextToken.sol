// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <=0.8.7;

import "./IERC20.sol";
import "./IERC20Metadata.sol";
import "./Context.sol";

contract AirnextToken is Context, IERC20, IERC20Metadata {
    mapping (address => uint256) internal _balances;

    mapping (address => mapping (address => uint256)) private _allowances;
    uint256 public _threshold; // Variable seuil pour un gros transfert
    
    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

  
    address  addressAdminAirnext;
    address  addressTokenSale;
    address  addressTeam;
    address  addressMarketing;
    
    address  immutable manager;  
    
    // 45% pour les ventes de jeton
    uint256  constant tsSupply = 103500000 * multiple; 
    // 45% pour Airnext
    uint256  constant AirnextSupply = 103500000 * multiple;
    //5% pour la addressTeam
    uint256  constant addressTeamSupply = 11500000 * multiple; 
    //5% pour le addressMarketing  11500000 AIRN
    uint256  constant marketSupply = 11500000 * multiple; 
    
    // multiple de 10*5 en rapport avec la décimal
    uint256 public constant multiple = 10**5; 
   
    // Liste de tous les tableaux gros transferts. 
    mapping (address => mapping(address => Latency)) public BigTransfers;
    
    
    // Initialisation des états REJET, EN ATTENTE ET VALIDE
    enum State{REJECTED, PENDING, VALIDATED} 
    
    event error(address _sender, string value);
    
    struct Latency {
        uint256 _amount;
        mapping (address => bool) TransferEvent; 
        uint loading;
        bool completed;
        State currState;
    }
    

    constructor(address _addressAdminAirnext, address _addressTokenSale, address _addressTeam, address _addressMarketing) {
        _name = "Airnext";
        _symbol = "AIRN";
        
        addressAdminAirnext = _addressAdminAirnext;
        addressTokenSale = _addressTokenSale;
        addressTeam = _addressTeam;
        addressMarketing = _addressMarketing;
        
        manager = msg.sender;
        
        _mint(_addressAdminAirnext, AirnextSupply);
        _mint(_addressTokenSale, tsSupply);
        _mint(_addressTeam, addressTeamSupply);
        _mint(_addressMarketing, marketSupply);
        
        // Referencer le seuil
        _threshold = 500000 * multiple;
    }
  
  
    // Décimals du Token AirN
    function decimals() public pure override returns(uint8){ 
        return 5;
    }
    
      // Choisir le minimum de seuil pour un gros transfert
    function setMinimumThreshold(uint256 threshold) external { 
     require (msg.sender == addressAdminAirnext || msg.sender == manager );
      _threshold = threshold * multiple;
    }
    
    // Changer les adresses des administrateurs pools
    function changeAddressPool(address _addressAdminAirnext, address _addressTokenSale, address _addressTeam, address _addressMarketing) 
    external returns(bool) {
        
        require(msg.sender == addressAdminAirnext || msg.sender == manager) ;
        
        addressAdminAirnext = _addressAdminAirnext;
        addressTokenSale = _addressTokenSale;
        addressTeam = _addressTeam;
        addressMarketing = _addressMarketing;
        
        return true;
        
    }
    
    
    function transfer(address payable recipient, uint256 _amount) public override returns (bool) {
         
        Latency storage bigTransfers = BigTransfers[msg.sender][recipient];
        
        if(bigTransfers.loading  > 0 && bigTransfers.loading < block.timestamp ){
            bigTransfers.currState = State.REJECTED;
        }
        
        require(_balances[msg.sender] >= _amount);
        require(bigTransfers.currState != State.PENDING, "You already have a pending transfer");
        if(_amount >= _threshold && (msg.sender == addressAdminAirnext || msg.sender == addressTokenSale || msg.sender == addressMarketing || msg.sender == addressTeam))
        
        {
             _createTransferLatency(msg.sender, recipient, _amount); // Créer une instance d'un gros transfert. 
                
        }
       
        else {
            
            _transfer(msg.sender, recipient, _amount); // Transfert qui au-dessous du seuil d'un gros transfert
            
        }
        
        return true;
        
    }
    
    // Validation du gros transfert par les administrateurs wallets. 
    function validateTransfer(address _sender, address _recipient) external returns(bool) { 
      Latency storage thisBigTransfers = BigTransfers[_sender][_recipient];
      
      require (thisBigTransfers._amount > 0, 'Ligne de tableau non valide');
      require (msg.sender == addressAdminAirnext || msg.sender == addressTokenSale || msg.sender == addressTeam); 
      require (block.timestamp <= thisBigTransfers.loading);
      require (thisBigTransfers.TransferEvent[msg.sender] == false);
      
      
      thisBigTransfers.TransferEvent[msg.sender] = true;
      
      bool  adminAirnextValidation = thisBigTransfers.TransferEvent[addressAdminAirnext];
      bool  tokenSaleValidation = thisBigTransfers.TransferEvent[addressTokenSale];
      bool  tokenTeamValidation = thisBigTransfers.TransferEvent[addressTeam];
      
      // 2 administrateurs sur 3 doient valider la transactions.
      if( adminAirnextValidation && tokenSaleValidation || tokenTeamValidation && tokenSaleValidation || tokenTeamValidation && adminAirnextValidation )
          
          {
                    thisBigTransfers.completed = true;
                    thisBigTransfers.currState = State.VALIDATED; // Appel de l'index et emission de l'état du transfer
                    transferLatency(_sender, _recipient);
                    return true;
          }
       else if (block.timestamp <= thisBigTransfers.loading && (adminAirnextValidation || tokenTeamValidation || tokenSaleValidation))
       
       {
           thisBigTransfers.currState = State.PENDING;
           thisBigTransfers.completed = false;
           return true;
           
       } 
       
       else {
                     thisBigTransfers.completed = false; 
                     thisBigTransfers.currState = State.REJECTED; // Appel de l'index et emission de l'état du transfer
                     return false;
       
            } 
     
    }
    
     function _isHolding(address _sender, address _recipient) internal returns(bool) {
      Latency storage newBigTransfers = BigTransfers[_sender][_recipient]; // Ajout d'une ligne sur le mapping du gros transfert  
        if (newBigTransfers._amount > 0 && newBigTransfers.currState == State.PENDING) {
              emit error(_sender, "You already have a pending transfer"); // si la transaction existe et que le status est en attente, alors le message d'erreur apparait
              return true;
        } 
      return false;
    }

    
    // Les administrateurs refusent le gros transfert
    function refuseTransfer(address _sender, address _recipient) public returns(bool){ 
     Latency storage thisBigTransfers = BigTransfers[_sender][_recipient];
     
       require (thisBigTransfers._amount > 0, 'Ligne de tableau non valide');
       require (msg.sender == addressAdminAirnext || msg.sender == addressTokenSale || msg.sender == addressTeam);
       thisBigTransfers.TransferEvent[msg.sender] = false;
       
      bool  adminAirnextValidation = thisBigTransfers.TransferEvent[addressAdminAirnext];
      bool  tokenSaleValidation = thisBigTransfers.TransferEvent[addressTokenSale];
      bool  tokenTeamValidation = thisBigTransfers.TransferEvent[addressTeam];
       
       if(!adminAirnextValidation && !tokenSaleValidation || !tokenTeamValidation && !tokenSaleValidation || !tokenTeamValidation && !adminAirnextValidation)
          
        {
           thisBigTransfers.completed = false;
           thisBigTransfers.currState = State.REJECTED;
           
        }
        
        
       return false; 
    }
  
    // Création d'une instance d'un gros transfert. 
     function _createTransferLatency(address _sender, address  payable _recipient, uint256 _amount) internal returns(bool) {
         Latency storage newBigTransfers = BigTransfers[_sender][_recipient]; // Ajout d'une ligne sur le mapping du gros transfert  
      
              
                newBigTransfers._amount = _amount;
                newBigTransfers.completed = false;
                newBigTransfers.loading = block.timestamp + 86400 ; // 24h = 86400
                newBigTransfers.currState = State.PENDING;
                newBigTransfers.TransferEvent[addressAdminAirnext] = false;
                newBigTransfers.TransferEvent[addressTokenSale] = false;
                newBigTransfers.TransferEvent[addressTeam] = false;

                return true;
    }

    // Envoie de la transaction du gros transfert par le sender.
    function transferLatency(address _sender, address _recipient) public returns(bool){ 
          Latency storage otherBigTransfers = BigTransfers[_sender][_recipient];
          
          require (otherBigTransfers._amount > 0, 'Ligne de tableau non valide');
          require(_balances[_sender] > 0 && _balances[_sender] >= otherBigTransfers._amount);
          
          if(otherBigTransfers.completed == true && block.timestamp <= otherBigTransfers.loading) {
              
            _balances[_recipient] += otherBigTransfers._amount; // balances[to] = balances[to] + tokens
            _balances[_sender] -= otherBigTransfers._amount; // balances[to] = balances[to] + tokens
              
            emit Transfer(_sender, _recipient,otherBigTransfers._amount);
            otherBigTransfers.currState = State.VALIDATED; //Appel de l'index et emission de l'état du transfer
            return true;
              
          }
              
          else {
                    otherBigTransfers.currState = State.REJECTED; //Appel de l'index et emission de l'état du transfer
                    return false;
         }
    }
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }


    
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
}

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, _msgSender(), currentAllowance - amount);

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(_msgSender(), spender, currentAllowance - subtractedValue);

        return true;
    }



    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        
        
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        _beforeTokenTransfer(sender, recipient, amount);
        
        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }
    
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
}