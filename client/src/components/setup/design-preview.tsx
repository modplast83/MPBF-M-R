import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Move, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DesignPreviewProps {
  frontDesignPath?: string | null;
  backDesignPath?: string | null;
  productName?: string;
}

interface TransformState {
  scale: number;
  rotation: number;
  translateX: number;
  translateY: number;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  frontDesignPath,
  backDesignPath,
  productName = "Product"
}) => {
  const [activeDesign, setActiveDesign] = useState<'front' | 'back'>('front');
  const [frontTransform, setFrontTransform] = useState<TransformState>({
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0
  });
  const [backTransform, setBackTransform] = useState<TransformState>({
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentDesignPath = activeDesign === 'front' ? frontDesignPath : backDesignPath;
  const currentTransform = activeDesign === 'front' ? frontTransform : backTransform;
  const setCurrentTransform = activeDesign === 'front' ? setFrontTransform : setBackTransform;

  // Reset transform when switching designs
  useEffect(() => {
    if (activeDesign === 'front') {
      setFrontTransform({
        scale: 1,
        rotation: 0,
        translateX: 0,
        translateY: 0
      });
    } else {
      setBackTransform({
        scale: 1,
        rotation: 0,
        translateX: 0,
        translateY: 0
      });
    }
  }, [activeDesign]);

  const handleZoom = (direction: 'in' | 'out') => {
    setCurrentTransform(prev => ({
      ...prev,
      scale: direction === 'in' 
        ? Math.min(prev.scale * 1.2, 5) 
        : Math.max(prev.scale / 1.2, 0.1)
    }));
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    setCurrentTransform(prev => ({
      ...prev,
      rotation: direction === 'cw' 
        ? prev.rotation + 90 
        : prev.rotation - 90
    }));
  };

  const handleReset = () => {
    setCurrentTransform({
      scale: 1,
      rotation: 0,
      translateX: 0,
      translateY: 0
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setCurrentTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'out' : 'in';
    handleZoom(direction);
  };

  const handleDownload = () => {
    if (currentDesignPath) {
      const link = document.createElement('a');
      link.href = currentDesignPath;
      link.download = `${productName}-${activeDesign}-design`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const transformStyle = {
    transform: `translate(${currentTransform.translateX}px, ${currentTransform.translateY}px) scale(${currentTransform.scale}) rotate(${currentTransform.rotation}deg)`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  if (!frontDesignPath && !backDesignPath) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Design Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No design files uploaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const PreviewContent = () => (
    <div className="space-y-4">
      {/* Design Selection Tabs */}
      {frontDesignPath && backDesignPath && (
        <div className="flex gap-2">
          <Button
            variant={activeDesign === 'front' ? 'default' : 'outline'}
            onClick={() => setActiveDesign('front')}
            size="sm"
          >
            Front Design
          </Button>
          <Button
            variant={activeDesign === 'back' ? 'default' : 'outline'}
            onClick={() => setActiveDesign('back')}
            size="sm"
          >
            Back Design
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleZoom('in')} variant="outline" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={() => handleZoom('out')} variant="outline" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={() => handleRotate('cw')} variant="outline" size="sm">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button onClick={() => handleRotate('ccw')} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
        {currentDesignPath && (
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Zoom Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Zoom: {Math.round(currentTransform.scale * 100)}%</label>
        <Slider
          value={[currentTransform.scale]}
          onValueChange={([value]) => setCurrentTransform(prev => ({ ...prev, scale: value }))}
          min={0.1}
          max={5}
          step={0.1}
          className="w-full"
        />
      </div>

      {/* Preview Container */}
      <div 
        ref={containerRef}
        className={`relative overflow-hidden bg-gray-50 border-2 border-gray-200 rounded-lg ${isFullscreen ? 'h-[70vh]' : 'h-64'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {currentDesignPath ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={currentDesignPath}
              alt={`${activeDesign} design`}
              className="max-w-none"
              style={transformStyle}
              draggable={false}
              onError={(e) => {
                console.error('Image failed to load:', currentDesignPath);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            
            {/* Info overlay */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {activeDesign === 'front' ? 'Front' : 'Back'} Design
            </div>
            
            {/* Transform info */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {Math.round(currentTransform.scale * 100)}% | {currentTransform.rotation}°
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No {activeDesign} design uploaded</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Click and drag to move the design</p>
        <p>• Use mouse wheel to zoom in/out</p>
        <p>• Use buttons or slider for precise control</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Design Preview
          </div>
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Move className="h-4 w-4 mr-1" />
                Fullscreen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Design Preview - {productName}</DialogTitle>
                <DialogDescription>
                  Interactive preview with zoom and rotate controls
                </DialogDescription>
              </DialogHeader>
              <PreviewContent />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PreviewContent />
      </CardContent>
    </Card>
  );
};

export default DesignPreview;