// joshua codes

const userData = JSON.parse(localStorage.getItem('gizmoUser'));
const userName = userData ? userData.name : 'Guest';

document.getElementById('userId').innerText = userName;

const startButton = document.getElementById('startButton');
const outputDiv = document.getElementById('outputText');
const outputImage = document.getElementById('outputImage');
const clearButton = document.getElementById('clear');
const generateButton = document.getElementById('generateImg');

//setting up generate button 
generateButton.disabled = true;
generate.onstart = () => (generateButton.textContent = 'Generating...');
generate.onend = () => (generateButton.textContent = 'Generate Image');
generateButton.addEventListener('click', generate);

const LANG = 'en-US';
let transcript = '';

// clear outputdiv content
clearButton.addEventListener('click', () => {
  outputDiv.textContent = '';
});

// starting speech recognition
const recognition = new(window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();

recognition.lang = LANG;
recognition.onresult = (event) => {
  transcript = event.results[0][0].transcript;
  outputDiv.textContent += ` ${transcript}`;
  generateButton.disabled = false;
};

recognition.onstart = () => (startButton.textContent = 'Listening...');
recognition.onend = () => (startButton.innerHTML = `<span class="material-symbols-outlined icon">
  mic
</span>`);
startButton.addEventListener('click', () => recognition.start());

// starting async function
async function generateImage(prompt, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function main() {
  try {
    generateButton.textContent = 'Generating...';
    const apiKey = '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';
    const imageData = await generateImage(transcript, apiKey);
    console.log('Generated image URL:', imageData.data[0].url);
    outputImage.src = imageData.data[0].url;
    outputDiv.textContent = '';
    const popupOverlay = document.getElementById('popupOverlay');
    const popupImage = document.getElementById('popupImage');
    const promptDescription = document.getElementById('promptDescription');
    const closePopup = document.getElementById('closePopup');
    const downloadBtn = document.getElementById('downloadBtn');
    const likeBtn = document.getElementById('likeBtn');
    
     popupImage.src = imageData.data[0].url;
    promptDescription.innerHTML = `<span class="material-symbols-outlined">
graphic_eq
</span> ${transcript}`;
    generateButton.disabled = true;
    generateButton.textContent = 'Generate Image';
    popupOverlay.classList.add('active');
    
      closePopup.onclick = () => {
    popupOverlay.classList.remove('active');
  };

    // TO close popup
   popupOverlay.onclick = (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove('active');
  }
};
  
    // Download image
    downloadBtn.onclick = async () => {
      try {
        const response = await fetch(imageData.data[0].url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image');
      }
    };
    
    // Like button toggle
    likeBtn.onclick = () => {
      likeBtn.classList.toggle('active');
      const icon = likeBtn.querySelector('.icon');
      icon.innerHTML = likeBtn.classList.contains('active') ? `<span class="material-symbols-outlined">
favorite
</span> ` : `<span class="material-symbols-outlined">
favorite
</span>`;
    };
    
   
  } catch (error) {
    console.error('Failed to generate image:', error);
  }
}

function generate() {
  if (outputDiv.textContent == '') {
    // tells the user an to input speech
    alert('Input voice');
  } else {
    // starts theb callback function for the image generation
    main();
  }
}
// editting for generate btn
