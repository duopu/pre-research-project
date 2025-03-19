import { Component, Inject, OnInit } from '@angular/core';
import { demoData, DropInfo, TreeNode } from './data';
import { DOCUMENT } from '@angular/common';
import { debounce } from '@agentepsilon/decko';

@Component({
  selector: 'app-test-drag4',
  templateUrl: './test-drag4.component.html',
  styleUrls: ['./test-drag4.component.less'],
})
export class TestDrag4Component implements OnInit {
  ngOnInit(): void {}

  items = [
    {
      id: 'new-item-50',
      children: [],
    },
    {
      id: 'new-item-51',
      children: [],
    },
    {
      id: 'new-item-52',
      children: [],
    },
    {
      id: 'new-item-53',
      children: [],
    },
  ];

  nodes: TreeNode[] = demoData;

  showLastLine = false;

  get ss() {
    return [...this.dropTargetIds, 'main'];
  }

  // ids for connected drop lists
  dropTargetIds = ['item2501'];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.prepareDragDrop(this.nodes);
  }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }

  @debounce(50)
  dragMoved(event) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      console.log('dragMoved1==============');
      this.clearDragInfo();
      return;
    }

    let container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.showLastLine = true;

      console.log('dragMoved2==============');

      this.clearDragInfo();
      return;
    }

    this.showLastLine = false;

    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };

    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      this.dropActionTodo['action'] = 'before';
      console.log('before');
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      this.dropActionTodo['action'] = 'after';
      console.log('after');
    } else {
      console.log('inside1');
      if (e.classList.contains('cant-drop-in')) {
        this.clearDragInfo(true);
        return;
      }
      console.log('inside2');
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event) {
    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;

    console.log('drop1  parentItemId=', parentItemId, '  draggedItemId=', draggedItemId);

    let targetListId = '';
    if (this.showLastLine) {
      targetListId = 'main';
    } else {
      if (!this.dropActionTodo?.targetId) {
        this.showLastLine = false;
        return;
      }
      targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
    }

    if (!this.dropActionTodo) {
      if (this.showLastLine /*&& ['new0', 'main'].includes(parentItemId)*/) {
        let nodeLastId = this.nodes[this.nodes.length - 1]?.id || 'main';
        this.dropActionTodo = { targetId: nodeLastId, action: 'after' };
      } else {
        this.showLastLine = false;
        return;
      }
    }

    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' + this.dropActionTodo.action + ']\n[' + this.dropActionTodo.targetId + '] from list [' + targetListId + ']',
      '\n ||event||',
      event
    );

    // Handle new items being dragged from left panel
    if (draggedItemId.startsWith('new-item-')) {
      const newNode: TreeNode = { id: 'item-' + Date.now(), children: [] };

      this.nodeLookup[newNode.id] = newNode;
      this.dropTargetIds.push(newNode.id);

      const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nodes;

      switch (this.dropActionTodo.action) {
        case 'before':
        case 'after':
          const targetIndex = newContainer.findIndex((c) => c.id === this.dropActionTodo.targetId);
          if (this.dropActionTodo.action == 'before') {
            newContainer.splice(targetIndex, 0, newNode);
          } else {
            newContainer.splice(targetIndex + 1, 0, newNode);
          }
          break;

        case 'inside':
          this.nodeLookup[this.dropActionTodo.targetId].children.push(newNode);
          break;
      }

      this.showLastLine = false;
      this.clearDragInfo(true);
      return;
    }

    this.innerOperate({ draggedItemId, parentItemId, targetListId });
  }

  innerOperate({ draggedItemId, parentItemId, targetListId }) {
    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].children : this.nodes;
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nodes;

    let i = oldItemContainer.findIndex((c) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex((c) => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem);
        break;
    }

    this.showLastLine = false;
    this.clearDragInfo(true);
  }

  log() {
    console.log(
      ' nodes=',
      this.nodes,
      '\n nodeLookup=',
      this.nodeLookup,
      '\n dropActionTodo=',
      this.dropActionTodo,
      '\n dropTargetIds=',
      this.dropTargetIds
    );
  }

  getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
    for (let node of nodesToSearch) {
      if (node.id == id) return parentId;
      let ret = this.getParentNodeId(id, node.children, node.id);
      if (ret) return ret;
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document.getElementById('node-' + this.dropActionTodo.targetId).classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document.querySelectorAll('.drop-before').forEach((element) => element.classList.remove('drop-before'));
    this.document.querySelectorAll('.drop-after').forEach((element) => element.classList.remove('drop-after'));
    this.document.querySelectorAll('.drop-inside').forEach((element) => element.classList.remove('drop-inside'));
  }
}
