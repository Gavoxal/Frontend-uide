import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, uploadedFile, onRemoveFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  if (uploadedFile) {
    // ... no changes in this block ...
    return (
      <Box
        sx={{
          border: '2px dashed #D1D5DB',
          borderRadius: 2,
          p: 2,
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 114,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              minWidth: 40,
              backgroundColor: '#FEE2E2',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DescriptionIcon sx={{ color: '#DC2626' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {uploadedFile.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {uploadedFile.size}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <IconButton size="small">
            <VisibilityIcon fontSize="small" sx={{ color: '#6B7280' }} />
          </IconButton>
          <IconButton size="small" onClick={onRemoveFile}>
            <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: isDragging ? '2px dashed #000A9B' : '2px dashed #D1D5DB',
        borderRadius: 2,
        p: 4,
        backgroundColor: isDragging ? '#EEF2FF' : '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minHeight: 114,
        '&:hover': {
          borderColor: '#000A9B',
          backgroundColor: '#F9FAFB',
        },
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
        Click to upload or drag and drop
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        PDF
      </Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  );
}
