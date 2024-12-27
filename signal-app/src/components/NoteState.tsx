import React,{useState} from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => {
    const [huffmanTree, setHuffmanTree] = useState<any | null>(null); 
    return (
        <NoteContext.Provider value={{huffmanTree, setHuffmanTree }}>
            {props.children}
        </NoteContext.Provider>
    );}

    export default NoteState;