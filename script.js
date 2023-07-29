"use strict";

const $getPicture = document.querySelector("#getPicture");
const $form = document.querySelector("#form");
const $modal = document.querySelector(".modal");

let ls = localStorage.getItem("logs");

const logs = ls ? JSON.parse(ls) : [];
const api_key = "t66CnwIGZhUP1HQPPqhKFrQNBSMhi0c3M88KenPs";
buildFavorite(logs);

$form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const $date = document.querySelector("#date");
  const dateText = $date.value;
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${dateText}`
  );
  const json = await response.json();

  buildAPO(json);
});

// Add the event listener for the image click
document.addEventListener("click", function (e) {
  if (e.target.matches(".img-apo")) {
    $modal.classList.add("show");
    $modal.innerHTML = `
        <div class='modal-content'><img src='${e.target.dataset.hdurl}'></div>
      `;
  }
});

function buildAPO(json) {
  const $div = document.querySelector("#apo-section");

  if (json.media_type === "image") {
    $div.innerHTML = `
    <div class="d-flex container align-items-center">
       <div class="card mb-3 position-relative" style="max-width: 1400px">
         <div class="row align-items-center g-0 " >
           <div class="col-md-4">
             <img
               src="${json.url}"
               class="img-fluid rounded-start img-apo"
               data-hdurl="${json.hdurl}"
             />
           </div>
           <div class="col-md-8">
             <div class="card-body">
               <h5 class="card-title">${json.title}</h5>
               <p class="card-text">
                ${json.explanation}
               </p>
               <p class="card-text">
                 <small class="text-muted">${json.date}</small>
               </p>
             </div>
           </div>
         </div>
         <button class="btn btn-link position-absolute bottom-0 end-0 m-3">
           <i class="fa-regular fa-heart " id="favorite"></i>
         </button>
       </div>
      
     </div> `;
  }

  //  else if (json.media_type === "video") {
  //   $div.innerHTML = `
  //   <div class="d-flex container align-items-center">
  //      <div class="card mb-3 position-relative" style="max-width: 1400px">
  //        <div class="row align-items-center g-0">
  //          <div class="col-md-4">
  //          <video src="${json.url}"  controls></video>
  //          </div>
  //          <div class="col-md-8">
  //            <div class="card-body">
  //              <h5 class="card-title">${json.title}</h5>
  //              <p class="card-text">
  //               ${json.explanation}
  //              </p>
  //              <p class="card-text">
  //                <small class="text-muted">${json.date}</small>
  //              </p>
  //            </div>
  //          </div>
  //        </div>

  //          <i class="fa-regular fa-heart " id="favorite"></i>

  //      </div>
  //    </div> `;
  // }

  $div.addEventListener("click", function (e) {
    if (e.target.matches(".img-apo")) {
      $modal.classList.add("show");
      $modal.innerHTML = `
        <div class='modal-content'><img id='hd-img' src='${e.target.dataset.hdurl}'/></div>
      `;
    }
  });

  $modal.addEventListener("click", function (e) {
    if (e.target.matches(".modal")) {
      $modal.classList.remove("show");
    }
  });

  const $favorite = $div.querySelector("#favorite");

  $favorite.addEventListener("click", function () {
    logs.unshift(json);
    buildFavorite(logs);
    saveHistory(logs);
  });

  return $div;
}

function createFavorite(log) {
  const $div = document.createElement("div");
  $div.innerHTML = `
 
  <div id="favorite-section" > 
    <img src="${log.url}" alt="apo" class="favorite-img" />
    <div>
      <h5>${log.title}</h5>
      <p>${log.date}</p>
      <div class="delete">
        <i class="fa-regular fa-trash-can" id="trash"></i>
      </div>
    </div>
    </div>
   
`;
  //

  $div.addEventListener("click", function (e) {
    if (e.target.classList.contains("fa-trash-can")) {
      e.target.closest("div");

      //remove the element
      $div.innerHTML = "";
      //remove the array
      const logIndex = logs.findIndex((l) => l.date === log.date);
      if (logIndex > -1) {
        logs.splice(logIndex, 1);
        saveHistory(logs); // save the updated logs array to localStorage
      }
    }
  });

  return $div;
}

function buildFavorite(logs) {
  const $div = document.querySelector("#favorites-section");
  $div.innerHTML = "";
  logs.forEach(function (log) {
    $div.append(createFavorite(log));
  });
}

//storage

function saveHistory(logs) {
  localStorage.setItem("logs", JSON.stringify(logs));
}
