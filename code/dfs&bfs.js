
class TreeNode {
     val = null;
     left = null;
     right = null;
     constructor(val, left, right) {
         this.val = (val===undefined ? 0 : val)
         this.left = (left===undefined ? null : left)
         this.right = (right===undefined ? null : right)
     }
}

/*深度优先遍历三种方式*/
let deepTraversal1 = (node, nodeList = []) => {
    if (node !== null) {
      nodeList.push(node)
      let children = node.children
      for (let i = 0; i < children.length; i++) {
        deepTraversal1(children[i], nodeList)
      }
    }
    return nodeList
  }
  let deepTraversal2 = (node) => {
      let nodes = []
      if (node !== null) {
        nodes.push(node)
        let children = node.children
        for (let i = 0; i < children.length; i++) {
          nodes = nodes.concat(deepTraversal2(children[i]))
        }
      }
      return nodes
    }
  // 非递归
  let deepTraversal3 = (node) => {
    let stack = []
    let nodes = []
    if (node) {
      // 推入当前处理的node
      stack.push(node)
      while (stack.length) {
        let item = stack.pop()
        let children = item.children
        nodes.push(item)
        // node = [] stack = [parent]
        // node = [parent] stack = [child3,child2,child1]
        // node = [parent, child1] stack = [child3,child2,child1-2,child1-1]
        // node = [parent, child1-1] stack = [child3,child2,child1-2]
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i])
        }
      }
    }
    return nodes
  }

  
  let widthTraversal2 = (node) => {
    let nodes = []
    let stack = []
    if (node) {
      stack.push(node)
      while (stack.length) {
        let item = stack.shift()
        let children = item.children
        nodes.push(item)
          // 队列，先进先出
          // nodes = [] stack = [parent]
          // nodes = [parent] stack = [child1,child2,child3]
          // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
          // nodes = [parent,child1,child2]
        for (let i = 0; i < children.length; i++) {
          stack.push(children[i])
        }
      }
    }
    return nodes
  }


// DFS 递归
const  PreorderRecursive = (root) => {
    if (root) {
        visit(root);
        PreorderRecursive(root.left); 
        PreorderRecursive(root.right); 
    }
}

// DFS 非递归
const PreorderNonRecursive = (root) => {
    const stk = [];
    stk.push(root);//节点入栈
    while(stk.length){
        p = stk.pop();//栈顶元素出栈并且访问该节点
        visit(p);
        if(p.left) stk.push(p.left);//右边节点入栈
        if(p.right) stk.push(p.right);
    }
}

 class TreeNode {
     val: number
     left: TreeNode | null
     right: TreeNode | null
     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
         this.val = (val===undefined ? 0 : val)
         this.left = (left===undefined ? null : left)
         this.right = (right===undefined ? null : right)
     }
 }

 class BSTIterator {
  iterator = null;
  nextValue = null;
  done = false;
  constructor(root: TreeNode | null) {
      this.iterator = this.travel(root);
      this.next();
  }
  travel(root: TreeNode | null) {
      if(!root) {
          return;
      }
      const { val, left, right } = root;

      yield* this.travel(left);
      yield val;
      yield* this.travel(right);
  }

  next(): number {
      const { value, done } = this.iterator.next();
      const result = this.nextValue;
      this.nextValue = value;
      this.done = done;
      return result;
  }

  hasNext(): boolean {
      return !this.done;
  }
}