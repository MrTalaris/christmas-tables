
// All things related to Language loading and switching

// Load language content per content-id

function loadLanguage(lang) {
    jQuery("[content-id]").each( function() {
        const contentId = jQuery(this).attr("content-id");
        const keys = contentId.split(" ");

        // If the content is an Array, make a list with each item
        if (Array.isArray( keys.reduce( (obj, key) => obj && obj[key], content[lang] ) )) {
            const items = keys.reduce( (obj, key) => obj && obj[key], content[lang] );
            listHTML = "";
            for (let i = 0; i < items.length; i++) {
                listHTML += "<li>" + items[i] + "</li>";
            }
            jQuery(this).html(listHTML);
        }else {
            jQuery(this).text(keys.reduce( (obj, key) => obj && obj[key], content[lang] ));
        }
    })
}

// Load languages and replace placeholders

var currentLanguage = "pt-br"; // Default language
var content = {};

jQuery(document).ready(function() {
    jQuery.when(
        jQuery.getJSON("src/json/en-us.json"),
        jQuery.getJSON("src/json/pt-br.json")
    ).done(function(enData, ptData) {
        // The data comes as [data, status, jqXHR]
        content = {
            "en-us": enData[0],
            "pt-br": ptData[0]
        };
        loadLanguage(currentLanguage);
    });
})

// Function to cycle through languages on the Language Button click

jQuery(".btn-language").on("click", function() {
    // Hide current language image
    jQuery(".img-" + currentLanguage).hide();
    // Get lenght of available languages
    const languages = Object.keys(content);
    const numLanguages = languages.length
    // Find position of current language
    const currentIndex = languages.indexOf(currentLanguage);
    // Calculate next language index
    const nextIndex = (currentIndex + 1) % numLanguages;
    // Set current language to next language
    currentLanguage = languages[nextIndex];
    // Load the new language
    loadLanguage(currentLanguage);
    // Show new language image
    jQuery(".img-" + currentLanguage).show();
})



// All things related to Page navigation

var currentPageId = "map"; // Default page

function changePage(newPageId) {
    // Fade out current page and fade in new page
    jQuery("#page-" + currentPageId).fadeOut(200, function() {
        jQuery("#page-" + newPageId).fadeIn(200);
        currentPageId = newPageId;
    })

    if (newPageId != "map"){
        jQuery(".btn-map").show();
        jQuery("#btn-fullscreen").hide();
        jQuery("#btn-cursor").hide();
    }else {
        jQuery(".btn-map").hide();
        jQuery("#btn-fullscreen").show();
        jQuery("#btn-cursor").show();
    }

    // Hide modals and backdrop when changing page
    jQuery(".modal, #modal-backdrop").fadeOut(200);
    isModalOpen = false;
}

// Add click event listeners to buttons with page-id attribute
jQuery("[page-id]").on("click", function() {
    const pageId = jQuery(this).attr("page-id");
    changePage(pageId);
})



// All things related to Menu buttons

// Return to map button

jQuery(".btn-map").on("click", function() {
    changePage("map");
})

// Show/hide cursor button

var isCursorVisible = true;
jQuery("#btn-cursor").on("click", function() {
    if (isCursorVisible) {
        jQuery("body").css("cursor", "none");
        isCursorVisible = false;
        jQuery(".btn-hide-cursor").hide();
        jQuery(".btn-show-cursor").show();
    }else {
        jQuery("body").css("cursor", "auto");
        isCursorVisible = true;
        jQuery(".btn-hide-cursor").show();
        jQuery(".btn-show-cursor").hide();
    }
})

// Fullscreen button

jQuery("#btn-fullscreen").on("click", function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        jQuery(".btn-enter-fullscreen").hide();
        jQuery(".btn-exit-fullscreen").show();
    }    

})

// If button is pressed 10 times in 10 seconds, exit fullscreen
let pressTimer = null;
let pressCount = 0;
jQuery("#btn-fullscreen").on("mousedown", function() {
    pressCount++;
    console.log("Fullscreen button pressed ", pressCount, " times");
    if (pressTimer === null) {
        pressTimer = setTimeout(function() {
            pressCount = 0;
            clearTimeout(pressTimer);
            pressTimer = null;
        }, 10000);
    }
    if (pressCount >= 10) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            jQuery(".btn-enter-fullscreen").show(); 
            jQuery(".btn-exit-fullscreen").hide();
        }
        pressCount = 0;
        clearTimeout(pressTimer);
        pressTimer = null;
    }
})

// Prevent user from opening the context menu on touchscreen devices

// Prevent right-click / long-press context menu on the app (exceptions allowed with .allow-context)
document.addEventListener('contextmenu', function(e) {
    // If you want to allow the context menu on specific elements, add .allow-context to them
    if (e.target.closest && e.target.closest('.allow-context')) return;
    e.preventDefault();
}, { passive: false });

// Make images non-draggable and disable long-press callout on touch devices
jQuery(function() {
    // set draggable attribute
    jQuery('img').attr('draggable', false);

    // prevent dragstart for images and elements you don't want dragged
    jQuery(document).on('dragstart', 'img, .no-drag, .no-drag *', function(e) {
        e.preventDefault();
        return false;
    });

    // add CSS properties that help on mobile / TV (touch callout, user-drag)
    jQuery('img').css({
        '-webkit-user-drag': 'none',
        '-khtml-user-drag': 'none',
        '-moz-user-drag': 'none',
        '-o-user-drag': 'none',
        'user-drag': 'none',
        '-webkit-touch-callout': 'none',
        'touch-action': 'manipulation' // reduces long-press gestures
    });
});


// If the user exits fullscreen with ESC, change the button state
document.addEventListener("fullscreenchange", function() {
    if (!document.fullscreenElement) {
        jQuery(".btn-enter-fullscreen").show(); 
        jQuery(".btn-exit-fullscreen").hide();
    }else {
        jQuery(".btn-enter-fullscreen").hide(); 
        jQuery(".btn-exit-fullscreen").show();
    }
})



// All things related to the interactive map

var isModalOpen = false;

// Function to open a modal according to the path's continent in class

function openContinentModal(continentClass) {
    const classToModalId = {
        'continent-south-america': 'modal-south-america',
        'continent-north-america': 'modal-north-america',
        'continent-europe': 'modal-europe',
        'continent-africa': 'modal-africa',
        'continent-asia': 'modal-asia',
        'continent-oceania': 'modal-oceania'
    }

    const modalId = classToModalId[continentClass];
    openModal(modalId);
}

// Get all positions using jQuery and getBBox()

var pathPositions = [];

jQuery("path").each( function() {
    var bbox = this.getBBox();
    pathPositions.push({
        "selector": jQuery(this),
        "x": jQuery(this).offset().left,
        "y": jQuery(this).offset().top,
        "width": bbox.width,
        "height": bbox.height
    })  
})

// Add click event listener to the map

jQuery('#page-map').on('click', function(event) {

    if (!isModalOpen) {
        // Get cursor position relative to the page
        var cursor= {
            x: event.pageX,
            y: event.pageY
        }

        console.log("Clicked on page at: ", cursor);

        // Check with path is the closest to the cursor click 

        closestPath = null;
        closestDistance = Infinity;

        pathPositions.forEach( function(path) {
            // Calculate the center of the path
            var pathCenter = {
                x: path.x + (path.width / 2),
                y: path.y + (path.height / 2)
            }
            // Calculate the distance from the cursor to the path center
            var distance = Math.abs(cursor.x - pathCenter.x) + Math.abs(cursor.y - pathCenter.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPath = path;
                // console.log("Distance to path: ", Math.abs(cursor.x - pathCenter.x), " plus ", Math.abs(cursor.y - pathCenter.y),
                //     "because cursor.x was ", cursor.x, " and pathCenter.x was ", pathCenter.x,
                //     " and cursor.y was ", cursor.y, " and pathCenter.y was ", pathCenter.y,
                //     " for path ", path);
            }
        })

        openContinentModal(closestPath.selector.attr('class').split(' ').find(c => c.startsWith('continent-')));
    }

});


// All modals functions

function openModal(modalId) {
    jQuery("#modal-backdrop").fadeIn(200);
    jQuery("#" + modalId).fadeIn(200);
    isModalOpen = true;
}

// Close modal when clicking on close button or backdrop

jQuery(".modal-close, #modal-backdrop").on("click", function() {
    jQuery(".modal, #modal-backdrop").fadeOut(200);
    isModalOpen = false;
});


// Modal opening for Recipes
jQuery(".food-item").on("click", function() {
    const foodId = jQuery(this).attr("id");
    const modalId = "modal-recipe-" + foodId;
    openModal(modalId);
})