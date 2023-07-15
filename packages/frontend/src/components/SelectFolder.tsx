import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { MenuItem, Select } from '@mui/material';


type SelectFolderTypes = {
    selectedFolder: string,
    handleSelectChange : (folderName: string) => void
}

const SelectFolder : React.FC<SelectFolderTypes>  = ( { selectedFolder, handleSelectChange }) => {
  return (
    <Box>
      <FormControl fullWidth variant="standard" size="small">
        <Select
          displayEmpty
          onChange={(e) =>  handleSelectChange(e.target.value)}
          value={selectedFolder}
          // sx={{ width: 250 }}
        >
          <MenuItem value="">
            <em>Select Folder</em>
          </MenuItem>
          <MenuItem value={0}>Default</MenuItem>
          <MenuItem value={1}>Add Folder</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
export default SelectFolder