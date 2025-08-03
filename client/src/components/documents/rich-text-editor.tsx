import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  List, 
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Code,
  Undo,
  Redo,
  Type,
  Palette,
  Languages,
  Eye,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "ابدأ الكتابة...",
  className,
  minHeight = "300px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fontSize, setFontSize] = useState('14');

  // Detect Arabic text
  const hasArabicText = (text: string) => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  };

  // Update content and detect language
  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      setIsArabic(hasArabicText(editorRef.current.textContent || ''));
    }
  };

  // Execute formatting command
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
    editorRef.current?.focus();
  };

  // Insert text at cursor
  const insertText = (text: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      updateContent();
    }
  };

  // Toggle text direction
  const toggleDirection = () => {
    if (editorRef.current) {
      const currentDir = editorRef.current.style.direction;
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      editorRef.current.style.direction = newDir;
      editorRef.current.style.textAlign = newDir === 'rtl' ? 'right' : 'left';
      setIsArabic(newDir === 'rtl');
      updateContent();
    }
  };

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
      setIsArabic(hasArabicText(value));
    }
  }, []);

  // Auto-detect language on input
  useEffect(() => {
    if (editorRef.current) {
      const content = editorRef.current.textContent || '';
      const shouldBeArabic = hasArabicText(content);
      if (shouldBeArabic !== isArabic) {
        editorRef.current.style.direction = shouldBeArabic ? 'rtl' : 'ltr';
        editorRef.current.style.textAlign = shouldBeArabic ? 'right' : 'left';
      }
    }
  }, [value, isArabic]);

  return (
    <Card className={cn("w-full border-2 focus-within:border-blue-500 transition-colors", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('bold')}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('italic')}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('underline')}
            className="h-8 w-8 p-0"
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('formatBlock', 'h1')}
            className="h-8 w-8 p-0"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('formatBlock', 'h2')}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('formatBlock', 'h3')}
            className="h-8 w-8 p-0"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('justifyFull')}
            className="h-8 w-8 p-0"
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className="h-8 w-8 p-0"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('undo')}
            className="h-8 w-8 p-0"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => execCommand('redo')}
            className="h-8 w-8 p-0"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Size */}
        <div className="flex items-center gap-2">
          <select
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              execCommand('fontSize', e.target.value);
            }}
            className="h-8 px-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">8px</option>
            <option value="2">10px</option>
            <option value="3">12px</option>
            <option value="4">14px</option>
            <option value="5">18px</option>
            <option value="6">24px</option>
            <option value="7">36px</option>
          </select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Language Toggle */}
        <Button
          type="button"
          variant="ghost" 
          size="sm"
          onClick={toggleDirection}
          className={cn("h-8 w-8 p-0", isArabic && "bg-blue-100 text-blue-600")}
          title={isArabic ? "Switch to English (LTR)" : "Switch to Arabic (RTL)"}
        >
          <Languages className="h-4 w-4" />
        </Button>

        {/* Preview Toggle */}
        <Button
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className={cn("h-8 w-8 p-0", showPreview && "bg-green-100 text-green-600")}
          title={showPreview ? "Edit Mode" : "Preview Mode"}
        >
          {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {showPreview ? (
          /* Preview Mode */
          <div 
            className={cn(
              "p-4 prose max-w-none",
              isArabic && "prose-rtl"
            )}
            style={{
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: isArabic ? 'right' : 'left',
              fontFamily: isArabic ? 'Tahoma, Arial, sans-serif' : 'inherit',
              minHeight
            }}
            dangerouslySetInnerHTML={{ __html: value || placeholder }}
          />
        ) : (
          /* Edit Mode */
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={updateContent}
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                  case 'b':
                    e.preventDefault();
                    execCommand('bold');
                    break;
                  case 'i':
                    e.preventDefault();
                    execCommand('italic');
                    break;
                  case 'u':
                    e.preventDefault();
                    execCommand('underline');
                    break;
                }
              }
            }}
            className={cn(
              "p-4 outline-none focus:ring-0 prose max-w-none",
              "border-0 resize-none",
              isArabic && "prose-rtl"
            )}
            style={{
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: isArabic ? 'right' : 'left',
              fontFamily: isArabic ? 'Tahoma, Arial, sans-serif' : 'inherit',
              minHeight,
              fontSize: `${parseInt(fontSize) + 10}px`
            }}
            data-placeholder={placeholder}
          />
        )}
        
        {/* Placeholder when empty */}
        {!value && !showPreview && (
          <div 
            className="absolute top-4 left-4 text-gray-400 pointer-events-none"
            style={{
              direction: isArabic ? 'rtl' : 'ltr',
              right: isArabic ? '16px' : 'auto',
              left: isArabic ? 'auto' : '16px'
            }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Footer with word count */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50/50 border-t text-sm text-gray-500">
        <div>
          {value && (
            <span>
              كلمات: {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} | 
              أحرف: {value.replace(/<[^>]*>/g, '').length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 rounded text-xs",
            isArabic ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          )}>
            {isArabic ? "عربي" : "English"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RichTextEditor;