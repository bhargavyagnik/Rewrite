let knownsubjectboxes = [];

function generate(text) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('cohereapiKey', ({ cohereapiKey }) => {
            if (!cohereapiKey) {
                reject("Cohere API key is not set. Go to Manage Extensions > Extension options ");
            } else {
                const options = {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        authorization: "Bearer " + cohereapiKey,
                    },
                    body: JSON.stringify({
                        model: "command",
                        prompt: text,
                        max_tokens: 300,
                        temperature: 0,
                        k: 3,
                        p: 0.75,
                        stop_sequences: ["--"],
                        return_likelihoods: "NONE",
                    }),
                };

                fetch('https://api.cohere.ai/v1/generate', options)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.generations[0].text === undefined) {
                            reject(response);
                        } else {
                            resolve(response.generations[0].text);
                        }
                    })
                    .catch((error) => {
                        reject("Error accessing API. Try again in a few minutes. If the issue persists, contact hello@bhargavyagnik.com");
                    });
            }
        });
    });
}

function generate_from_subject(subjectBox){
    text = subjectBox.children['subjectbox'].value;
    subjectBox.lastChild.style.backgroundColor = 'grey';
    subjectBox.lastChild.disabled = true;
    prompttext = "Write an email as you are a professional email writer and not a chatbot So give direct email content only nothing else strictly. Start with formal/informal greetings and and finally conclude with regards or thanks accordingly.The email should start with Hello [Name] or Dear [Maam] or any other salutation, the mail which expresses the interest of sender completely and subject should be kept in mind. At the end, give proper ending remarks. Make sure it is consive and do not ask for feedback. The subject for your email is "+text;
    generate(prompttext)
        .then((generatedText) => {
            console.log(generatedText);
            p = subjectBox.parentElement.parentElement;
            t = p.querySelector('[aria-label="Message Body"][g_editable="true"][role="textbox"]');
            //t.style.whiteSpace = 'pre';
            l = generatedText.split('\n');
            t.textContent = l[0];
            ctr = 0
            for (var i = 1; i < l.length; i++) {
                
                var divElement = document.createElement('div');
                divElement.textContent = l[i];
                var brel = document.createElement('br');
                divElement.appendChild(brel);
                t.appendChild(divElement);
                
            }
        })
        .catch((error) => {
            alert(error);
        })
        .finally(() => {
            subjectBox.lastChild.style.backgroundColor = '#5b0eeb68';
            subjectBox.lastChild.disabled = false;
        });
}   



async function addGmailButton() {
    // Wait for the subjectbox element to be available in the DOM
    await new Promise((resolve) => {
        const interval = setInterval(() => {
           
            subjectBoxes = document.getElementsByName('subjectbox');
            if (subjectBoxes.length > 0) {
                subjectBoxes.forEach((subjectBox) => {
                    if (!knownsubjectboxes.includes(subjectBox.id)){
                        knownsubjectboxes.push(subjectBox.id);
                        subjectBox = subjectBox.parentElement;
                        // Create a new button element
                        const btn = document.createElement('button');
                        btn.id = 'rewrite-gmail-button-'+knownsubjectboxes.length;
                        btn.textContent = 'Generate';
                        // Style the button
                        btn.style.backgroundColor = '#5b0eeb68';
                        btn.style.border = 'none';
                        btn.style.color = 'white';
                        btn.style.justifyContent = 'center';
                        btn.style.alignItems = 'center';
                        // Add a click event listener to the button
                        btn.addEventListener('click', () => {
                             //add execution of generate function here
                             generate_from_subject(subjectBox);
                        });
                        // Append the button to the subjectbox element
                        subjectBox.style.display = "flex"
                        subjectBox.appendChild(btn);
                    }
                });   
                resolve();
            }
            else{
                knownsubjectboxes = [];
            }
        }, 1000);
    });
}


addGmailButton();
