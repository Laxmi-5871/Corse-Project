// ===============================
// LOAD DATA
// ===============================

const lostItems =
JSON.parse(localStorage.getItem("lostItems")) || [];

const foundItems =
JSON.parse(localStorage.getItem("foundItems")) || [];


// ===============================
// IMAGE SIMILARITY CHECK
// ===============================

function imageSimilar(img1, img2){

    if(!img1 || !img2){
        return false;
    }

    const name1 = img1.split("/").pop().toLowerCase();
    const name2 = img2.split("/").pop().toLowerCase();

    const clean1 = name1.replace(/\.[^/.]+$/, "");
    const clean2 = name2.replace(/\.[^/.]+$/, "");

    return (
        clean1.includes(clean2) ||
        clean2.includes(clean1)
    );
}


// ===============================
// HELPERS (IMPORTANT FIX)
// ===============================

function getName(item){
    return (item.title || item.itemName || item.name || "")
        .toLowerCase()
        .trim();
}

function getCategory(item){
    return (item.category || "")
        .toLowerCase()
        .trim();
}


// ===============================
// MATCHING FUNCTION
// ===============================

function isMatch(lost, found){

    const lostName = getName(lost);
    const foundName = getName(found);

    const lostCategory = getCategory(lost);
    const foundCategory = getCategory(found);

    const nameMatch =
        lostName.includes(foundName) ||
        foundName.includes(lostName);

    const categoryMatch =
        lostCategory === foundCategory;

    const imageMatch =
        imageSimilar(lost.image, found.image);

    return nameMatch || categoryMatch || imageMatch;
}


// ===============================
// DISPLAY MATCHES
// ===============================

function showMatchedItems(){

    const container = document.getElementById("matchesContainer");

    if(!container){
        console.log("matchesContainer not found in HTML");
        return;
    }

    container.innerHTML = "";

    let matched = [];

    lostItems.forEach(lost => {

        foundItems.forEach(found => {

            if(isMatch(lost, found)){

                const alreadyExists = matched.some(
                    m => m.lost.id === lost.id && m.found.id === found.id
                );

                if(alreadyExists) return;

                matched.push({ lost, found });

                container.innerHTML += `
                <div class="card">

                    <div style="display:flex; gap:10px; justify-content:center;">

                        <div>
                            <img src="${lost.image || ''}"
                            width="140" height="140"
                            style="object-fit:cover; border-radius:8px;">
                            <p style="text-align:center; font-size:12px;">Lost</p>
                        </div>

                        <div>
                            <img src="${found.image || ''}"
                            width="140" height="140"
                            style="object-fit:cover; border-radius:8px;">
                            <p style="text-align:center; font-size:12px;">Found</p>
                        </div>

                    </div>

                    <div style="text-align:center; margin-top:10px;">
                        <span style="
                            background:#4CAF50;
                            color:white;
                            padding:5px 10px;
                            border-radius:5px;
                            font-size:12px;">
                            Matched
                        </span>
                    </div>

                    <h3 style="text-align:center;">
                        ${getName(lost)}
                    </h3>

                    <p style="text-align:center;">
                        <b>Category:</b> ${lost.category || ''}
                    </p>

                </div>
                `;
            }
        });
    });

    if(matched.length === 0){
        container.innerHTML = `
            <p style="text-align:center; color:gray; font-size:18px;">
                No Matched Items Found
            </p>
        `;
    }
}


// ===============================
// RUN ON LOAD
// ===============================

showMatchedItems();