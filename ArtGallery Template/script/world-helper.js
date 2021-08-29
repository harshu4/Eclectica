let a=[
    'admin/apple-icon.png',
    'admin/asset-manifest.json',
    'admin/favicon.png',
    'admin/index.html',
    'admin/manifest.json',
    'admin/static/css/2.35f0bdc3.chunk.css',
    'admin/static/css/2.35f0bdc3.chunk.css.map',
    'admin/static/css/main.1a710109.chunk.css',
    'admin/static/css/main.1a710109.chunk.css.map',
    'admin/static/js/2.9951abd4.chunk.js',
    'admin/static/js/2.9951abd4.chunk.js.LICENSE.txt',
    'admin/static/js/2.9951abd4.chunk.js.map',
    'admin/static/js/main.60fdb5ae.chunk.js',
    'admin/static/js/main.60fdb5ae.chunk.js.LICENSE.txt',
    'admin/static/js/main.60fdb5ae.chunk.js.map',
    'admin/static/js/runtime-main.a8d48391.js',
    'admin/static/js/runtime-main.a8d48391.js.map',
    'admin/static/media/fa-brands-400.0fea2496.eot',
    'admin/static/media/fa-brands-400.c967a94c.woff2',
    'admin/static/media/fa-brands-400.dc2cbadd.woff',
    'admin/static/media/fa-brands-400.e33e2cf6.svg',
    'admin/static/media/fa-brands-400.ec82f282.ttf',
    'admin/static/media/fa-regular-400.06b9d19c.svg',
    'admin/static/media/fa-regular-400.08f9891a.eot',
    'admin/static/media/fa-regular-400.1008b522.woff2',
    'admin/static/media/fa-regular-400.1069ea55.woff',
    'admin/static/media/fa-regular-400.1495f578.ttf',
    'admin/static/media/fa-solid-900.10ecefc2.ttf',
    'admin/static/media/fa-solid-900.371dbce0.svg',
    'admin/static/media/fa-solid-900.3a24a60e.eot',
    'admin/static/media/fa-solid-900.3ceb50e7.woff2',
    'admin/static/media/fa-solid-900.46fdbd2d.woff',
    'admin/static/media/nucleo.35b08447.ttf',
    'admin/static/media/nucleo.5c65ef4d.woff',
    'admin/static/media/nucleo.6dfb4833.woff2',
    'admin/static/media/nucleo.bd5cce8b.eot',
    'admin/static/media/react-logo.561f1671.png',
    'agora/AgoraAudioHandler.js',
    'agora/AgoraRTC.js',
    'agora/AgoraVideoHandler.js',
    'agora/audience.html',
    'agora/AudioManager.js',
    'agora/PresentationManager.js',
    'agora/test.html',
    'Build/final_build.data.unityweb',
    'Build/final_build.framework.js.unityweb',
    'Build/final_build.loader.js',
    'Build/final_build.wasm.unityweb',
    'circle/helper.js',
    'index.html',
    'TemplateData/favicon.ico',
    'TemplateData/fullscreen-button.png',
    'TemplateData/progress-bar-empty-dark.png',
    'TemplateData/progress-bar-empty-light.png',
    'TemplateData/progress-bar-full-dark.png',
    'TemplateData/progress-bar-full-light.png',
    'TemplateData/style.css',
    'TemplateData/unity-logo-dark.png',
    'TemplateData/unity-logo-light.png',
    'TemplateData/webgl-logo.png'
];

let loc =window.location.href;
let repo = 'hackathonmeta'



async function hostMetaverse(title){
    for(let path of a){
        try{
            let fetch_url = loc+"/"+repo+"/"+path;
            path='/'+title+'/'+path;
            await storeFiles(fetch_url,path)
        }catch(e){
            console.log(e)
            throw("")
        }
    }
    console.log("Metaverse Done!")
}