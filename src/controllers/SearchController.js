const Dev = require("./../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(request, response) {
    console.log(request.query);
    // busca devs no raio de 10km
    // filtra por techs

    const { latitude, longitude, techs } = request.query;
    // console.log(techs);
    const techsArray = parseStringAsArray(techs);
    // console.log(techsArray);

    // $in semelhante ao query IN
    // https://docs.mongodb.com/manual/reference/operator/query/
    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        //   $near encontra localizações próximas
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          //   $maxDistance distância máxima, em metros
          $maxDistance: 10000
        }
      }
    });
    return response.json({ devs });
  }
};
