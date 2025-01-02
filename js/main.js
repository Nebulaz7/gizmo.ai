// joshua codes



const userData = JSON.parse(localStorage.getItem('gizmoUser'));
const userName = userData ? userData.name : 'Guest';




document.getElementById('userId').innerText = userName;

const startButton = document.getElementById('startButton');
const outputDiv = document.getElementById('outputText');
const outputImage = document.getElementById('outputImage');
const clearButton = document.getElementById('clear');
const generateButton = document.getElementById('generateImg');
const modelSelect = document.getElementById('modelSelect');

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
  document.querySelector('.placeholder').textContent = '';
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
        model: modelSelect.value,
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
    const apiKey = '';
    const imageData = await generateImage(transcript, apiKey);
    console.log('Generated image URL:', imageData.data[0].url);
    outputImage.src = imageData.data[0].url;
    // outputDiv.textContent = '';
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
  generateButton.disabled = false;
  location.reload();
  // outputDiv.textContent = '';
};

    // TO close popup
 popupOverlay.onclick = (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove('active');
    generateButton.disabled = false;
    location.reload();
  //  outputDiv.textContent = '';
  }
};
  
    // Download image
    
    // Function to handle image download
const handleImageDownload = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error('No image URL provided');
  }

  try {
    
    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create download
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-image-${Date.now()}.png`;

    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Using with the download button
downloadBtn.onclick = async () => {
  try {
    const imageUrl = imageData?.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('Image URL not found');
    }

    await handleImageDownload(imageUrl);
  } catch (error) {
    console.error('Download failed:', error);
    alert(`Failed to download image: ${error.message}`);
  }
};
    
    
    
    
    // downloadBtn.onclick = async () => {
    //   try {
    //     const response = await fetch(imageData.data[0].url);
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `generated-image-${Date.now()}.png`;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error('Download failed:', error);
    //     alert('Failed to download image');
    //   }
    // };
    
   
    
    // Like button toggle
   likeBtn.onclick = () => {
  likeBtn.classList.toggle('active');
  const icon = likeBtn.querySelector('.icon');
  icon.innerHTML = likeBtn.classList.contains('active') 
    ? '<span class="material-symbols-outlined">favorite</span>' 
    : '<span class="material-symbols-outlined">favorite</span>';
    
  if (likeBtn.classList.contains('active')) {
    saveLikedImage(popupImage.src, transcript);
  }
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

 // saving liked image to history function
    
    function saveLikedImage(imageUrl, prompt) {
  const likedImages = JSON.parse(localStorage.getItem('likedImages') || '[]');
  likedImages.unshift({ url: imageUrl, prompt, timestamp: Date.now() });
  localStorage.setItem('likedImages', JSON.stringify(likedImages));
  updateLikedImagesDisplay();
}

function updateLikedImagesDisplay() {
  const likedImagesDiv = document.getElementById('likedImages');
  const likedImages = JSON.parse(localStorage.getItem('likedImages') || '[]');

  likedImagesDiv.innerHTML = likedImages.map(img => `
    <div class="history-item">
      <img src="${img.url}" alt="Generated Image">
      <p>${img.prompt}</p>
      <small>${new Date(img.timestamp).toLocaleString()}</small>
    </div>
  `).join('');
}
    

// Initial load of liked images
document.addEventListener('DOMContentLoaded', updateLikedImagesDisplay);

function handleSignOut() {
  if (confirm('Are you sure you want to sign out? This will delete all saved history.')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

// Add event listener to sign out link
document.querySelector('a[href="index.html"]').addEventListener('click', (e) => {
  e.preventDefault();
  handleSignOut();
});
