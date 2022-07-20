App = {
    loading: false,
    contracts: {}, 

    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      // Is there is an injected web3 instance?
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // If no injected web3 instance is detected, fallback to Truffle Develop.
        App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545');
        web3 = new Web3(App.web3Provider);
      }

      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          // web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
          console.log("Error Connecting to Ethereum")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = await web3.eth.getAccounts()
      console.log(App.account[0])
    },

    loadContract: async () => {
      const todoList = await $.getJSON('ToDoList.json');
      //Getting the smart contract json file
      //To do operations with our contract using truffle we need to do this
      App.contracts.TodoList = TruffleContract(todoList);
      App.contracts.TodoList.setProvider(App.web3Provider);//Also need to set the provider of web3
      //Creating a (deployed)contract instance from the actual blockchain of type App.
      //Check that the same variable 'todoList' is used to get the json file too

      App.todoList = App.contracts.TodoList.deployed();
    },
  
    render: async() => {
      //To Prevent double render
      if(App.loading){
          return
      }
      //Update app loading state
      App.setLoading(true);

      //Then render account
      $('#account').html(App.account)

      //Then update loading state
      App.setLoading(false);
    },

    setLoading:(status)=> {
      App.loading=status;
      const loader=$('#loader');
      const content=$('#content');

      if(status) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }

    },  

  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })