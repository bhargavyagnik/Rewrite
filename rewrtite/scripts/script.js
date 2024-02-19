function showDropdown2() {
  var dropdown1 = document.getElementById("dropdown1");
  var dropdown2 = document.getElementById("dropdown2");

  // Check the selected option of Dropdown 1
  var selectedOption = dropdown1.options[dropdown1.selectedIndex].value;
  // Show Dropdown 2 when a specific option is selected
  if (selectedOption === "email") {
    // Modify the options for Dropdown 2 when "Email" is selected
    dropdown2.innerHTML = `
      <option value=""></option>
      <option value="Reply to the given email">Reply</option>
      <option value="accept a meeting request or a time suggestion">Meeting Accept</option>
      <option value="introduce yourself to a cold contact">Introduct yourself</option>
      <option value="request about ">Request</option>
      <option value="offer your company's product/services to a potential customer/client"> Sales outreach</option>
      <option value="congratulate the recipient on their achievement">Congratulate</option>
      `;
      document.getElementById("singleLineInput").value = "Write an email to ";
  }  else if (selectedOption ==='chat'){
    // Reset Dropdown 2 to the default options
    dropdown2.innerHTML = `
      <option value=""></option>
      <option value="Formal conversation">Formal</option>
      <option value="Informal conversation">Informal</option>
      <option value="Friendly conversation">Friendly</option>
      <option value="Supportive conversation">Supportive</option>
      <option value="Assertive conversation">Assertive</option>
      <option value="Diplomatic conversation">Diplomatic</option>
      <option value="Humorous conversation">Humorous</option>
      <option value="Serious conversation">Serious</option>
      <option value="Curious conversation">Curious</option>
    `;
    document.getElementById("singleLineInput").value = "Rewrite this chat as a ";
  }  else if (selectedOption==='write'){
    // Reset Dropdown 2 to the default options
    dropdown2.innerHTML = `
      <option value=""></option>
      <option value="detailed Blog post">Blog Post</option>
      <option value="social media post or a caption">Social Media Post</option>
      <option value="detailed documentation">Documentation </option>
      <option value="Express your creativity through stories, poems, or fiction writing">Creative</option>
      <option value="scholarly or academic paper with research findings, arguments">Research</option>
      <option value="Business Report or proposal">Business</option>  
    `;
    document.getElementById("singleLineInput").value = "Write a ";
   }
   else{
    // Reset Dropdown 2 to the default options
    dropdown2.innerHTML = `
    `;
    dropdown2.style.display="none";
    document.getElementById("singleLineInput").value = "Rewrite this to articulate better ";
   }


  // Show or hide Dropdown 2 based on the selected option of Dropdown 1
  if (selectedOption !== "customprompt") {
    dropdown2.style.display = "block";
  }
}

function updatecommand(){
  var dropdown1 = document.getElementById("dropdown1");
  var dropdown2 = document.getElementById("dropdown2");
  var selectedOption1 = dropdown1.options[dropdown1.selectedIndex].value;
  var selectedOption2 = dropdown2.options[dropdown2.selectedIndex].value;
  if (selectedOption1 === "email"){
    document.getElementById("singleLineInput").value = "Write an email to " + selectedOption2;
  }
  else if (selectedOption1 === "chat"){
    document.getElementById("singleLineInput").value = "Rewrite this chat as a " + selectedOption2;
  }
  else if (selectedOption1 === "write"){
    document.getElementById("singleLineInput").value = "Write a " + selectedOption2;
  }
  else{
    document.getElementById("singleLineInput").value = "Rewrite this to articulate better ";
  }
}


document.getElementById('dropdown1').addEventListener('change', function(event) { 
  showDropdown2();
});

document.getElementById('dropdown2').addEventListener('change', function(event) { 
  updatecommand();
});

function generate(text) {
  showLoadingSpinner()
  // Use the user's stored API key
  chrome.storage.sync.get('cohereapiKey', ({ cohereapiKey }) => {
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
        hideLoadingSpinner();
        if (response.generations[0].text === undefined) {
          alert(response);
        } else {
          document.getElementById("generated-text").textContent  = response.generations[0].text;
          document.getElementById("generated-text").style.display = "block";
          document.getElementById("copyButton").style.display = "block";
        }
      })
      .catch((error) => {
        hideLoadingSpinner();
        alert("Error Accessing API, try again in few minutes.\n(Hint: The Free API has rate limit of 5 calls/minute. Upgrade to Production API in that case.)\n\nIf issue persists, contact hello@bhargavyagnik.com");
      });
  });
}

function main() {
  chrome.storage.sync.get('cohereapiKey', ({ cohereapiKey }) => {
    if (!cohereapiKey) {
      alert("Cohere API key is not set. Go to Manage Extensions > Extension options ")
    } else {
      const selectedText = document.getElementById('textInput').value+"Using the above context, "+document.getElementById("singleLineInput").value;
      generate(selectedText);
    }
  });
  
}

function showLoadingSpinner() {
  // Show loading spinner by modifying CSS or adding/removing classes
  document.getElementById('copyButton').style.display = 'none';
  document.getElementById('generated-text').style.display = 'none';
  document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
  // Hide loading spinner by modifying CSS or adding/removing classes
  document.getElementById('loadingSpinner').style.display = 'none';
}

function copyText() {
  var textToCopy = document.getElementById("generated-text").textContent;
  
  // Create a temporary input element to copy the text
  var tempInput = document.createElement("input");
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}




document.getElementById('genButton').addEventListener('click', function(event) { 
  event.preventDefault();
  main();
});

document.getElementById('copyButton').addEventListener('click', function(event) { 
  event.preventDefault();
  copyText();
});

