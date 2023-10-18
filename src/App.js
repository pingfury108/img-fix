import { useState } from 'react';
import './App.css';

function ImgDisply({ visible, fname }) {
    if (!visible) {
        return <img src={fname}></img>;
    } else {
        return (<></>)
    }
}

function ImgSelect({ visible, onchange }) {
    if (visible) {
        return <input type='file' onChange={onchange}></input>;
    } else {
        return (<></>)
    }
}

function App() {
    const [imgPath, setImgPath] = useState("");
    const [noImg, setnoImg] = useState(true);

    function imgChange(evt) {
        if (evt.target.files && evt.target.files[0]) {
            setImgPath(URL.createObjectURL(evt.target.files[0]));
            setnoImg(false);
        }
        console.log(imgPath);
    };

    return (
        <div className="container mx-auto">
            <div className="columns-2" >
                <div id="img-disply">
                    <ImgSelect visible={noImg} onchange={imgChange} />
                    <ImgDisply visible={noImg} fname={imgPath} />
                </div>
                <div id='option'>
                    <h1 className="text-3xl font-bold underline">
                        Hello world!
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default App;
