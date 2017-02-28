//构造函数，实现模版
function Compiler(el,data){
  this.$el = document.querySelector(el);
  this.data = data;
  if(this.$el){
    this.$fragment = this.nodeToFragment(this.$el);
    this.compile(this.$fragment,this.data);
    this.$el.appendChild(this.$fragment);
  }
}

Compiler.prototype = {

  nodeToFragment: function(node){
    let fragment = document.createDocumentFragment(); //创建一个文档片段
    let child;
    //遍历节点
    while(child = node.firstChild){
        if(this.isIgnorable(child)){
            node.removeChild(child);
        }else{
            fragment.appendChild(child);
        }
    }
    return fragment;
  },

  //判断注释节点以及空格换行等
  isIgnorable: function(node){
      let regIgnorable = /^[\t\n\r]+/;
      return (node.nodeType == 8) || ((node.nodeType == 3) && (regIgnorable.test(node.textContent)));
  },

  //遍历传入节点的子节点，如果是元素节点则继续遍历，文本节点则处理
  compile: function(node,data){
    let that = this
    Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 1) {
            that.compileElementNode(child,that.data);
        }
        if (child.nodeType === 3) {
            that.compileTextNode(child,that.data);
        }
    })
  },
  // 文本节点处理
  compileTextNode: function(node,data){
      let text = node.textContent.trim();
      let exp = parseTextExp(text,data);
      node.textContent = exp;
  },

  //元素节点继续遍历直到文本节点
  compileElementNode: function(node,data){
      this.compile(node,data);
  }
}

//data一直传递到此函数，在次函数中将匹配的模版替换(和别人比改成了笨办法把，但是自己理解的比较清除)
function parseTextExp(text,data) {
    let regText = /\{\{(.+?)\}\}/g;
    let pieces = text.split(regText);
    let matches = text.match(regText);
    let result = [];
    pieces.forEach(function (piece) {
        if(matches && matches.indexOf('{{' + piece + '}}') > -1){ //包含模版的项
          let properties = piece.split('.');
          let datas = data;
          properties.forEach(function(value){
            datas = datas[value];
          });
          result.push(datas);
        }else if(piece){ //正常项
          result.push(piece);
        }
    });
    return result.join('');
}
