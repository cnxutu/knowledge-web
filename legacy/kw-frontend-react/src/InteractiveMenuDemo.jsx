import React, { useState } from 'react';
import { motion } from 'framer-motion';

// 模拟数据：结构可以是动态加载的
const DATA = [
  {
    id: 'sys1',
    title: '监管系统',
    children: [
      {
        id: 'menu1',
        title: '数据录入',
        functions: [
          {
            id: 'feature1',
            title: '录入功能',
            description: '这是数据录入功能，帮助用户录入信息。',
            flowchart: '功能流程图的占位',
            relations: {
              before: '无',
              after: '审批功能'
            }
          }
        ]
      },
      {
        id: 'menu2',
        title: '审批管理',
        functions: [
          {
            id: 'feature2',
            title: '审批功能',
            description: '这是审批管理功能，帮助管理员审批数据。',
            flowchart: '审批流程图的占位',
            relations: {
              before: '录入功能',
              after: '展示功能'
            }
          }
        ]
      }
    ]
  }
];

const InteractiveMenuDemo = () => {
  const [selectedPath, setSelectedPath] = useState(['sys1']); // 默认从第一个系统开始
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 点击菜单时更新路径
  const handleMenuClick = (path) => {
    setSelectedPath(path);
    setSelectedFeature(null); // 清除功能显示
  };

  // 点击功能时展示详细信息
  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  // 生成菜单
  const renderMenu = (menuItems, level = 0) => {
    return menuItems.map((item) => {
      const isActive = selectedPath[level] === item.id;
      return (
        <motion.div
          key={item.id}
          onClick={() => handleMenuClick([...selectedPath.slice(0, level), item.id])}
          style={{ cursor: 'pointer', paddingLeft: `${level * 20}px`, fontWeight: isActive ? 'bold' : 'normal' }}
          animate={{ backgroundColor: isActive ? '#e0e0e0' : 'transparent' }}
        >
          {item.title}
          {item.children && renderMenu(item.children, level + 1)} {/* 递归子菜单 */}
        </motion.div>
      );
    });
  };

  // 渲染功能详细信息
  const renderFeatureDetail = (feature) => {
    return (
      <div>
        <h2>{feature.title}</h2>
        <p>{feature.description}</p>
        <p><strong>流程图:</strong> {feature.flowchart}</p>
        <p><strong>前置功能:</strong> {feature.relations.before}</p>
        <p><strong>后置功能:</strong> {feature.relations.after}</p>
      </div>
    );
  };

  // 获取当前菜单或功能项
  const getCurrentItem = () => {
    let current = DATA; // 默认从顶部菜单开始
    for (let i = 0; i < selectedPath.length; i++) {
      const currentItem = current.find((item) => item.id === selectedPath[i]);
      if (!currentItem || !currentItem.children) {
        return []; // 如果找不到对应项或没有子项，返回空数组
      }
      current = currentItem.children; // 更新当前菜单项为子级菜单
    }
    return current;
  };

  const currentMenuItems = getCurrentItem();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', padding: '10px', borderRight: '1px solid #ddd' }}>
        {renderMenu(DATA)}
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        {selectedFeature ? renderFeatureDetail(selectedFeature) : (
          <div>
            <h2>请选择功能</h2>
            {currentMenuItems.map((item) => (
              item.functions.map((func) => (
                <motion.div
                  key={func.id}
                  onClick={() => handleFeatureClick(func)}
                  style={{ cursor: 'pointer', marginBottom: '10px', padding: '5px', border: '1px solid #ccc' }}
                  whileHover={{ scale: 1.05 }}
                >
                  {func.title}
                </motion.div>
              ))
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMenuDemo;
