//构造函数接收一个对象
function Vue(object){
  this.data = object.data || {};
  this.el = object.el;
  new Observer(this.data);
  new Compiler(this.el,this.data);
}
