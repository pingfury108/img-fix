import { useState } from 'react';
import './App.css';

function ImgDisply({ visible, fname }) {
  if (!visible) {
    return <img src={fname} alt='img'></img>;
  } else {
    return (<></>)
  }
}

function ImgSelect({ onchange }) {
  return <input type='file' onChange={onchange}></input>;
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
      <div className="flex h-screen">
        <div id="img-disply" className='w-2/3 p-2 border border-0 rounded-lg'>
          <ImgDisply visible={noImg} fname={imgPath} />
        </div>
        <div id='option' className='w-1/3 p-2 border border-0 rounded-lg'>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <ImgSelect onchange={imgChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
