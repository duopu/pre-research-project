export interface TreeNode {
  id: string;
  children: TreeNode[];
  type?: string;
  [key: string]: any;
}

export interface DropInfo {
  targetId?: string;
  action?: string;
  moveAtBaseComponent?: boolean;
  targetParentId?: string;
  showParentBorder?: number;
}

export var demoData: TreeNode[] = [
  /* {
    id: 'item 1',
    children: [],
  },
  {
    id: 'item 2',
    children: [
      {
        id: 'item 2.1',
        children: [],
      },
      {
        id: 'item 2.2',
        children: [],
      },
      {
        id: 'item 2.3',
        children: [],
      },
    ],
  },
  {
    id: 'item 3',
    children: [],
  },*/
];
