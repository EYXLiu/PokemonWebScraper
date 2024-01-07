  const pokemonList = [];

  const axios = require('axios')
  const cheerio = require('cheerio')

  const pokemon = (name, number, type, secondary, health, attack, defense, specialAttack, specialDefense, speed) => ({
    name, number, type, secondary, health, attack, defense, specialAttack, specialDefense, speed
  })

  const url = "https://www.serebii.net/pokemon/nationalpokedex.shtml";
  async function html_scraper(website) {
    const response = await axios(website);
    const html = response.data;
    const $ = cheerio.load(html);
    const allRows = $('body #wrapper #content main table.dextable tr:gt(1)');
    allRows.each(function(index, element) {
      const number = $(element).find('td:nth-child(1)').text().trim();
      const pokemonName = $(element).find('td:nth-child(3) a').text().trim();
      const typing = $(element).find('td:nth-child(4) a');
      let firstType;
      let secondType;
      if (typing.length > 1) {
        firstType = typing.eq(0).attr('href').split('/')
        firstType = firstType[firstType.length-1]
        secondType = typing.eq(1).attr('href').split('/')
        secondType = secondType[secondType.length-1]
      } else {
        firstType = typing.eq(0).attr('href')
        if (typeof firstType !== 'undefined') {
          firstType = typing.eq(0).attr('href').split('/')
          firstType = firstType[firstType.length-1]
        }
        secondType = 'none'
      }
      const hp = $(element).find('td:nth-child(6)').text().trim();
      const att = $(element).find('td:nth-child(7)').text().trim();
      const def = $(element).find('td:nth-child(8)').text().trim();
      const satt = $(element).find('td:nth-child(9)').text().trim();
      const sdef = $(element).find('td:nth-child(10)').text().trim();
      const spd = $(element).find('td:nth-child(11)').text().trim();
      pokemonList.push(pokemon(pokemonName, number, firstType, secondType, hp, att, def, satt, sdef, spd))
    });
  };

  async function main() {
    await html_scraper(url);
    let i = pokemonList.length;
    while (i--) (i + 1) % 2 === 0 && (pokemonList.splice(i, 1));
    console.log(pokemonList)
  }

  main();

