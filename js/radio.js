/* Radio script 101.ru
 * Author: AlekPet
 * Full code this: https://github.com/AlekPet/Grab-Radio-101.ru
 */
function panelv2_menu(obj) {
  let div = $(
      "<div id='radio_box'>" +
        "<div class='main_title'>Radio List 101.ru</div>" +
        "<div id='names'><ul class='menu_radios'></ul></div>" +
        "<div id='outputs'>Пусто, выберите элемент!</div>" +
        "<div id='foot' style='display:flex;justify-content: space-between;'><button onclick=\"$('#box_codes').toggle('slow')\">Получить код</button><span>by AlekPet</span></div>" +
        "<div id='box_codes'>" +
        "<div class='textarea_info'><span>None info</span><div onclick=\"$('#box_codes').toggle('slow')\">X</div></div>" +
        "<textarea id='texta' spellcheck='false'></textarea>" +
        "</div>" +
        "</div>"
    ),
    ul_menu = $(div).find(".menu_radios"),
    // All radios
    _liAll = $("<li>")
      .text("Все")
      .attr("title", "Все")
      .click(function () {
        $(".menu_radios > li.selactive").removeClass();
        $(this).addClass("selactive");
        $("#outputs").empty();

        let counts = 0;
        const r_obj = { radio_list: {} };

        for (let o in obj) {
          const genre = obj[o];

          counts += genre.radio.length;
          $("#outputs").append($("<div class='main_title_small'>").text(o));
          const outuptCode = loadRadioSelected(genre);
          r_obj.radio_list[genre.name] = outuptCode;
        }

        $("#texta").val(JSON.stringify(r_obj));
        $("#radio")
          .find(".textarea_info > span")
          .text(`Количество радиостанций: ${counts} (Все)`);
      });

  ul_menu.append(_liAll);

  // Make list ganres radios and ouput 1 ganres
  for (let o in obj) {
    let genre = obj[o],
      _li = $("<li>")
        .text(o)
        .attr("title", o)
        .click(function () {
          $(".menu_radios > li.selactive").removeClass();
          $(this).addClass("selactive");
          $("#outputs").empty();

          const outuptCode = loadRadioSelected(genre);
          $("#texta").val(
            JSON.stringify({ radio_list: { [genre.name]: outuptCode } })
          );
          $("#radio")
            .find(".textarea_info > span")
            .text(`Количество радиостанций: ${genre.radio.length} (${o})`);
        });

    ul_menu.append(_li);
  }
  $("#radio").empty().append(div);

  // Load default
  $(".menu_radios > li.selactive").removeClass();
  $(ul_menu).find("li:eq(1)").addClass("selactive");
  $("#outputs").empty();

  const outuptCode = loadRadioSelected(obj["Топ каналов"]);
  $("#texta").val(
    JSON.stringify({ radio_list: { "Топ каналов": outuptCode } })
  );
  $("#radio")
    .find(".textarea_info > span")
    .text(
      `Количество радиостанций: ${obj["Топ каналов"].radio.length} (Топ каналов)`
    );
}

function loadRadioSelected(genre) {
  const ul = $("<ul>");
  const host = "http://101.ru/";

  let text = "";

  const r_obj = genre.radio.map(({ name, image, canvasik, json, link }) => {
    text +=
      '<li><a href="' +
      link +
      '" class="noajax" data-tooltip-block="#topchan82">' +
      '<div class="cover logo" style="background-color: #eeeeee"><img src="' +
      image +
      '" alt="' +
      name +
      '" width="440px"></div>' +
      '<div class="h3 caps htitle">' +
      name +
      "</div>" +
      "</a>";

    const data_radio = {
      title: name,
      poster: image,
      mp3: json.map((url) => {
        text +=
          "<div>" +
          url +
          '</div><audio controls preload="none"><source src="' +
          url +
          '" type="audio/mpeg"></source></audio>';
        return url;
      }),
    };

    return data_radio;
  });

  $(ul).html(text);
  $("#outputs").append(ul);

  return r_obj;
}
