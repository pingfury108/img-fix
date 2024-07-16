import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useState } from 'react';
import './App.css';

const ffmpeg = new FFmpeg();
await ffmpeg.load();

function ImgDisply({ visible, fname }) {
  if (!visible) {
    return <img src={fname} alt='img'></img>;
  } else {
    return (<></>)
  }
}

function VideoDisply({ visible, fname }) {
  if (!visible) {
    return <video controls>
      <source src={fname}></source>
    </video >;
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
  const [videoPath, setVideoPath] = useState("");
  const [videoData, setVideoData] = useState("");
  const [noVideo, setNoVideo] = useState(true);
  const [t, setT] = useState("00:00:01");


  function imgChange(evt) {
    if (evt.target.files && evt.target.files[0]) {
      setImgPath(URL.createObjectURL(evt.target.files[0]));
      setnoImg(false);
    }
    console.log(imgPath);
  };

  function videoChange(evt) {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        setVideoData(e.target.result);
        setVideoPath(file);
        setNoVideo(false);
      };

      reader.readAsDataURL(file);
    }
    console.log(imgPath);
  };

  return (
    <div className="container mx-auto">
      <div className="flex h-screen w-full">
        <div id="img-disply" className='w-2/3 p-2 border border-0 rounded-lg'>
          <VideoDisply visible={noVideo} fname={videoData} />
        </div>
        <div id='option' className='w-1/3 p-2 border border-0 rounded-lg'>
          <div className='h-1/3'>
            <h2 className="text-3xl font-bold underline">
              视频提取图片
            </h2>
            <div className='container'>
              <label>选择视频</label>
              <ImgSelect onchange={videoChange} />
            </div>
            <div>
              <label>输入进度时间</label>
              <input type='text' value={t} onChange={e => {
                setT(e.target.value)
              }}></input>
            </div>
            <div>
            </div>
            <button
              onClick={_ => {
                (async () => {
                  await ffmpeg.writeFile('input.webm', await fetchFile(videoPath));
                  //-ss 00:01:30 -vframes:v 1 ttt_frame.png
                  await ffmpeg.exec(['-i', 'input.webm', '-ss', `${t}`, '-vframes:v', '1', 'output.png']).catch(v => {
                    console.log("ffmpeg exec err: ", v);
                  });

                  const data = await ffmpeg.readFile('output.png');
                  setImgPath(URL.createObjectURL(new Blob([Uint8Array.from(data)], { type: 'image/png' })));
                  setnoImg(false);
                })();
              }}>提取</button>
          </div>
          <div className='h-2/3'>
            <ImgDisply visible={noImg} fname={imgPath} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
