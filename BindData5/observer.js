  function Observer(data,parent,parentKey){
    this.data = data;
    this.watch = {};
    //传递参数，确定父级及其key
    this.parent = parent;
    this.parentKey = parentKey;
    this.travel(data);
  }

  let prototype = Observer.prototype;

  prototype.$watch = function (key, callback) {
    this.watch[key] = callback;
  }

  prototype.travel = function(object){
    let value;
    for(let key in object){
      //只遍历绑定在对象上的属性
      if(object.hasOwnProperty(key)){
        value = object[key];
        if(typeof value === 'object'){
          //有父级则传递相应参数
          new Observer(value,this,key);
        }
        this.convert(key,value);//给每个属性添加相应的getter setter方法
      }
    }
  }


  prototype.convert = function(key, value){
      /*Object.defineProperty(obj, prop, descriptor) 将属性添加到对象，或修改现有属性的特性。
        descriptor 要求传入一个对象，其默认值如下，
          {
            configurable: false,
            enumerable: false,
            writable: false,
            value: null,
            set: undefined,
            get: undefined
          }
          参数不一一列举，可以到https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty  查看api
      */
      this.$watch(key, function(newValue){ // 设置统一监听事件
        console.log(`你设置了 ${key}, 新的值为${newValue}`);
      });

      var that = this;
      Object.defineProperty(this.data, key, {
          enumerable: true,
          configurable: true,
          get: function(){
              console.log(`你访问了${key}`);
              return value;
          },
          set: function(newValue){
              if(that.parent){
                that.parent.watch[that.parentKey](newValue); // 父类监听事件
              }
              that.watch[key](newValue); // 回调监听 取代下面那条语句
              if(newValue === value){
                return;
              }
              value = newValue;
          }
      })
  };
