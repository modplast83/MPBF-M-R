import React, { memo, useCallback, useMemo } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
  DraggableProps,
} from 'react-beautiful-dnd';

// Optimized Droppable wrapper to reduce warnings
const OptimizedDroppable = memo<DroppableProps>(function OptimizedDroppable(props) {
  return <Droppable {...props} ignoreContainerClipping={false} />;
});

// Optimized Draggable wrapper to reduce warnings
const OptimizedDraggable = memo<DraggableProps>(function OptimizedDraggable(props) {
  return <Draggable {...props} />;
});

// Optimized DragDropContext wrapper
interface OptimizedDragDropContextProps {
  onDragEnd: (result: DropResult) => void;
  children: React.ReactNode;
  isDragDisabled?: boolean;
}

export const OptimizedDragDropContext = memo<OptimizedDragDropContextProps>(
  function OptimizedDragDropContext({ onDragEnd, children, isDragDisabled = false }) {
    // Memoize the onDragEnd handler to prevent unnecessary re-renders
    const handleDragEnd = useCallback((result: DropResult) => {
      if (isDragDisabled) return;
      onDragEnd(result);
    }, [onDragEnd, isDragDisabled]);

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
    );
  }
);

// Export the optimized components
export { OptimizedDroppable, OptimizedDraggable };

// Utility function to generate stable IDs for drag and drop
export const generateStableId = (prefix: string, index: number): string => {
  return `${prefix}-${index}`;
};

// Helper hook for drag and drop performance optimization
export const useDragDropOptimization = () => {
  const getItemStyle = useCallback((isDragging: boolean, draggableStyle: any) => ({
    // Change background colour if dragging
    background: isDragging ? 'lightblue' : 'grey',
    
    // Styles we need to apply on draggables
    ...draggableStyle,
  }), []);

  const getListStyle = useCallback((isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 8,
    width: 250,
  }), []);

  return { getItemStyle, getListStyle };
};