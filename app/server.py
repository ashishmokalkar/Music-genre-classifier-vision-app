from fastai.vision import *
from fastai import *
import librosa.display
import matplotlib.pyplot as plt
import aiohttp
import asyncio
import uvicorn

from io import BytesIO
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import HTMLResponse, JSONResponse, FileResponse
from starlette.staticfiles import StaticFiles
#import librosa

#export_file_url = 'https://www.dropbox.com/s/6bgq8t6yextloqp/export.pkl?raw=1'
export_file_url = 'https://drive.google.com/uc?export=download&id=1qJ5KwiM2XgTcK5LiCJ6czaAVmFZQR6yo'
export_file_name = 'export.pkl'

classes = ['Pop', 'Jazz', 'Rock']
path = Path(__file__).parent

app = Starlette()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_headers=['X-Requested-With', 'Content-Type'])
app.mount('/static', StaticFiles(directory='app/static'))


async def download_file(url, dest):
    if dest.exists(): return
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.read()
            with open(dest, 'wb') as f:
                f.write(data)


async def setup_learner():
    await download_file(export_file_url, path / export_file_name)
    try:
        learn = load_learner(path, export_file_name)
        return learn
    except RuntimeError as e:
        if len(e.args) > 0 and 'CPU-only machine' in e.args[0]:
            print(e)
            message = "\n\nThis model was trained with an old version of fastai and will not work in a CPU environment.\n\nPlease update the fastai library in your training environment and export your model again.\n\nSee instructions for 'Returning to work' at https://course.fast.ai."
            raise RuntimeError(message)
        else:
            raise


loop = asyncio.get_event_loop()
tasks = [asyncio.ensure_future(setup_learner())]
learn = loop.run_until_complete(asyncio.gather(*tasks))[0]
loop.close()


@app.route('/')
async def homepage(request):
    html_file = path / 'view' / 'index.html'
    return HTMLResponse(html_file.open().read())

@app.route('/spectrogram', methods=['POST'])
async def spectrogram(request):
    img_data = await request.form()
    img_bytes = await (img_data['file'].read())
    #img = open_image(BytesIO(img_bytes))
    aud = BytesIO(img_bytes)
    print("Yeahhhhhhhhhhhhhhh")
    samples, sr = librosa.load(aud)
    #samples, sr = librosa.load(img_data)
    print("File loaded successfully")
    X = librosa.stft(samples)
    print("Stft successfully")
    Xdb = librosa.amplitude_to_db(abs(X))
    print("Amplitude to db successfully")
    plt.figure(figsize=(14, 5))
    p = librosa.display.specshow(Xdb, sr=sr, x_axis='time', y_axis='log')
    #plt.colorbar()
    #base = os.path.basename(audio_file_path)
    #filename_, ext = os.path.splitext(base)
    plt.savefig("spec.png")
    print("File saved successfully")
    #return FileResponse('test.png',media_type='image/png')
    return FileResponse('spec.png')


@app.route('/mel', methods=['POST'])
async def spectrogram(request):
    img_data = await request.form()
    img_bytes = await (img_data['file'].read())
    #img = open_image(BytesIO(img_bytes))
    aud = BytesIO(img_bytes)
    print("Yeahhhhhhhhhhhhhhh")
    y, sr = librosa.load(aud)
    print("File loaded successfully")

    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)

    #X = librosa.stft(samples)
    #print("Stft successfully")
    #Xdb = librosa.amplitude_to_db(abs(X))
    S_dB = librosa.power_to_db(S, ref=np.max)
    print("Power to db successfully")
    plt.figure(figsize=(14, 5))
    p = librosa.display.specshow(S_dB, sr=sr, x_axis='time', y_axis='mel', fmax=8000)
    plt.savefig("mel.png")
    print("File saved successfully")
    #return FileResponse('test.png',media_type='image/png')
    return FileResponse('mel.png')



@app.route('/analyze', methods=['POST'])
async def analyze(request):
    #img_data = await request.form()
    #img_bytes = await (img_data['file'].read())
    #img = open_image(BytesIO(img_bytes))
    img = open_image("spec.png")
    prediction = learn.predict(img)[0]
    print("Prediction Done...Sending results")
    return JSONResponse({'result': str(prediction)})


if __name__ == '__main__':
    if 'serve' in sys.argv:
        uvicorn.run(app=app, host='0.0.0.0', port=5050, log_level="info")
