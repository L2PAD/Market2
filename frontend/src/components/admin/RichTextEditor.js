import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Rich Text Editor Component
 * 
 * A comprehensive text editor with support for:
 * - Text formatting (bold, italic, underline, etc.)
 * - Headers (H1-H6)
 * - Lists (ordered and unordered)
 * - Images and videos
 * - Links
 * - Code blocks and quotes
 * 
 * @param {string} value - Current HTML content
 * @param {function} onChange - Callback when content changes
 * @param {string} placeholder - Placeholder text
 */
const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Enter product description...' 
}) => {
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
        style={{ 
          minHeight: '400px',
          backgroundColor: 'white'
        }}
      />
      
      <style jsx global>{`
        .rich-text-editor-wrapper .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: inherit;
        }
        
        .rich-text-editor-wrapper .ql-editor {
          min-height: 400px;
          padding: 20px;
        }
        
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background-color: #f9fafb;
          border-color: #e5e7eb;
          padding: 12px;
        }
        
        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #e5e7eb;
        }
        
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px auto;
          border-radius: 8px;
        }
        
        .rich-text-editor-wrapper .ql-editor h1,
        .rich-text-editor-wrapper .ql-editor h2,
        .rich-text-editor-wrapper .ql-editor h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 700;
        }
        
        .rich-text-editor-wrapper .ql-editor p {
          margin-bottom: 16px;
          line-height: 1.8;
        }
        
        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        
        .rich-text-editor-wrapper .ql-editor li {
          margin-bottom: 8px;
        }
        
        .rich-text-editor-wrapper .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #10b981;
          padding-left: 16px;
          margin: 16px 0;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
