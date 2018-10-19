/* Radio script 101.ru
 * Author: AlekPet
 * Full code this: https://github.com/AlekPet/Grab-Radio-101.ru
*/
function panelv2_menu(obj) {
  let div = $("<div id='radio_box'>" + "<div class='main_title'>Radio List 101.ru</div>" + "<div id='names'><ul class='menu_radios'></ul></div>" + "<div id='outputs'>Пусто, выберите элемент!</div>" + "<div id='foot'>by AlekPet</div>" + "</div>"),

    ul_menu = $(div).find(".menu_radios"),

    // All radios
    _liAll = $("<li>").text("Все").attr("title", "Все").click(function() {
      $(".menu_radios > li.selactive").removeClass()
      $(this).addClass("selactive")
      $("#outputs").empty();

      let outuptCode = "",
        counts = 0
      for (let o in obj) {
        let genre = obj[o]
        counts += genre.radio.length
        $("#outputs").append($("<div class='main_title_small'>").text(o))
        outuptCode = loadRadioSelected(genre, outuptCode)
      }
    })

  ul_menu.append(_liAll)

  // Make list ganres radios and ouput 1 ganres
  for (let o in obj) {
    let genre = obj[o],
      _li = $("<li>").text(o).attr("title", o).click(function() {
        $(".menu_radios > li.selactive").removeClass()
        $(this).addClass("selactive")
        $("#outputs").empty();

        let outuptCode = ""
        outuptCode = loadRadioSelected(genre, outuptCode)
      })

    ul_menu.append(_li)
  }
  $("#radio").append(div)

  // Load default
  $(".menu_radios > li.selactive").removeClass()
  $(ul_menu).find("li:eq(1)").addClass("selactive")
  $("#outputs").empty();

  let outuptCode = ""
  outuptCode = loadRadioSelected(obj["Лучшие станции"], outuptCode)
}

function loadRadioSelected(genre, outuptCode) {
  let ul = $("<ul>"),
    text = ""

  for (let i = 0; i < genre.radio.length; i++) {
    outuptCode += '{\n'

    let radio = genre.radio[i],
    host = 'http://101.ru/'

    text += '<li><a target="_blank" href="' + host + radio.link + '" class="noajax" data-tooltip-block="#topchan82">' + '<div class="cover logo" style="background-color: #eeeeee"><img src="' + radio.image + '" alt="' + radio.name + '"></div>' + '<div class="h3 caps htitle">' + radio.name + '</div>' + '</a>';

    outuptCode += '"title":"' + radio.name + '",\n"artist":"' + genre.name + ' - 101.ru",\n"poster":"' + radio.image + '",\n'

    for (let s = 0; s < radio.json.length; s++) {
      text += '<div>' + radio.json[s] + '</div><audio controls preload="none"><source src="' + radio.json[s] + '" type="audio/mpeg"></source></audio>';
      outuptCode += '"mp3":"' + radio.json[s] + '"'
      if (s < radio.json.length - 1)
        outuptCode += ',\n'
    }
    outuptCode += '\n}'

    if (i < genre.radio.length - 1)
      outuptCode += ',\n'

    text += '</li>';
  }

  $(ul).html(text)
  $("#outputs").append(ul)

  return outuptCode
}
