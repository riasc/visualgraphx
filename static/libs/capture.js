/* */
define(['libs/underscore'], function(_) {

    function createPNG(options) {
        var xml = createXML(options); // serialize xml

        var canvas = document.createElement("canvas");
        canvas.width = parseInt(options.$el.find('svg').first().css('width'));
        canvas.height = parseInt(options.$el.find('svg').first().css('height'));
        var context = canvas.getContext("2d");

        var image = new Image;
        image.src = 'data:image/svg+xml;base64,'+ btoa(xml);


        context.drawImage(image, 0, 0);

        var a = document.createElement("a");
        a.download = "graphexport.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
  };

    function createPDF(options) {

        options.$el.find('svg').attr({
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1'
        });

        console.log(options.$el.find('svg'));

        return xepOnline.Formatter.Format('canvas');
    };

    // export as SVG
    function createSVG(options) {
        console.debug('capture.js:: - createSVG');

        var blob = new Blob([createXML(options)], { "type" : "application/octet-stream" });
        var blobURL = window.URL.createObjectURL(blob);
        //window.open(blobURL);

        var clickevent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        saveAs(blob, 'aada.svg');

        /*
        var element = document.createElement('a');
        element.href = blobURL;
        var cancelled = !element.dispatchEvent(clickevent);

        if(cancelled) {
            // A handler called preventDefault
            alert("canceled");
            element.href = blobURL;
            element.download = 'adsa.svg';

        } else {
            // None of the handlers called preventDefault
            alert("not canceled");
        }*/


        //window.location.download = 'blbla.svg';
        //window.location.href = 'data:none/none;base64,' + btoa(createXML(options));

        /*
        var element = document.createElement('a'); // create link object
        element.href = blobURL;
        element.download = 'graphexport.svg'; // set filename of export
        element.click();*/
    };

    function createXML(options) {
            var $el = options.$el;

            // get the dimensions
            var nsvgs = $el.find('svg').length;
            var height = parseInt($el.find('svg').first().css('height'));
            var width = parseInt($el.find('svg').first().css('width'));

            // serialize svg
            var serializer = new XMLSerializer();

            // retrieve the global stylesheets
            for(key in document.styleSheets) { // iterate through the stylesheets
                var sheet = document.styleSheets[key];
                var rules = sheet.cssRules;
                 if(rules) {
                    for(rule in rules) {
                        try {
                            $el.find(rules[rule].selectorText).each(function (i, elem) {
                                elem.style.cssText += rules[rule].style.cssText;
                            });
                        } catch (err) {
                        }
                    }
                }
            }

            var $svg = $el.find('svg');
            $svg.attr({
                xmlns: "http://www.w3.org/2000/svg",
                version: '1.1'
            });

            return serializer.serializeToString($svg[0]);
    };

    return {
        createPNG: createPNG,
        createPDF: createPDF,
        createSVG: createSVG
    }
});
