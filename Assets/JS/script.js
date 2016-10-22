var app = new Vue({
  el: '#navigation-wrapper',
  data: {
    navigation: [
      {name: 'HOME', icon: 'home', selected: true},
      {name: 'PROJECTS', icon: 'assignment', selected: false},
      {name: 'MESSAGES', icon: 'chat', selected: false},
      {name: 'PROFILE', icon: 'account_circle', selected: false}
    ]
  },
  methods:{
    selectItem: function(placement){
      for(var i = 0; i < this.navigation.length; i++){
        this.navigation[i].selected = false;
      }
      this.navigation[placement].selected = true;
    }
  }
}
