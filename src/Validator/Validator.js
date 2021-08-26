var inputs = [];

function clearArray(component_id){
    if(inputs[component_id] == undefined){
        inputs[component_id] = [];
    }
    inputs[component_id] = inputs[component_id].filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    })
    
    inputs[component_id] = inputs[component_id].filter(k => k != null);
}

function removeFromStack(name , component_id){
    if(inputs[component_id] == undefined){
        inputs[component_id] = [];
    }
    let index = inputs[component_id].findIndex(k => k == name);
    if(index != -1){
        delete inputs[component_id][index];
    }
    clearArray(component_id);
}

function addToStack(name,component_id){
    if(inputs[component_id] == undefined){
        inputs[component_id] = [];
    }
    inputs[component_id].push(name);
    clearArray(component_id);
}

function isAllValid(component_id = 0){
    if(inputs[component_id] == undefined){
        inputs[component_id] = [];
    }
    return !inputs[component_id].length;
}

export default  {
    checkInput : (name , data , component_id = 0)=>{
        let state = !data[name];
        if(state){
            addToStack(name,component_id);
        }else{
            removeFromStack(name,component_id);
        }
        return state;
    },
    equalTo : (current , target , data ) => {
        return !(data[current] == data[target]);
    },
    checkEmail : (email) => {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        let state = reg.test(email) == false ;
        if(state){
            addToStack("email_value");
        }else{
            removeFromStack("email_value");
        }

       return state;

    },
    checkDate : (date) => {
        // var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/
        // let state = dateReg.test(date) == false ;
        // return state;
    },
    isValid : (name , component_id = 0) => {
        return inputs[component_id].findIndex(k => k == name) == -1;
    },
    isFormValid : (component_id) => {
        return isAllValid(component_id);
    },
    reset : (component_id) =>{
        if(component_id){
            inputs[component_id] = [];
        }else{
            inputs = [];
        }
    }
}