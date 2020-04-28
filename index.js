const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  //передаем сюда аргумент - название файла
  return new Promise((resolve, reject) => {
    //возвращаем промис, он принимает одну executor function //здесь происходит вся асинхронная работа //executor function - вызывается сразу после создания промиса. принимает 2 аргумента функции resolve, reject
    fs.readFile(file, (err, data) => {
      //fs.readFile выполнится, в него передаем имя нужного файла и колбэк, 2 аргумента в колбэк - эррор и данные
      if (err) reject('I could not find that file'); //в случае ошибки - вызываем функцию reject. То значение что передается в reject будет далее доступно как аргумент в методе catch
      resolve(data); //в случае успеха вызываем функцию resolve с данными. То значение что передается в resolve будет далее доступно как аргумент в методе then. Это результат работы промиса и будет потом доступен в обработчике
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file');
      resolve('Success');
    });
  });
};

const getDogPic = async () => {
  //асинхронная функция. продолжает работать в фоновом режиме, выполняя код внутри, пока остальная часть нашего кода продолжает крутится в event loоp-e. async не блокирует event loоp
  //возвращает промис// внутри у нее всегда может быть один или больше await выражении
  try {
    //для обработки ошибок оборачиваем в try/catch //сначала будет попытка выполнить указанныи в try код
    const data = await readFilePro(`${__dirname}/dog.txt`); //сохраняем результат выполнения промиса в переменную //await останавлявает код от выполнения, до получения resolve // Если промис выполнен (успешен) тогда значение выражения await - resolved значение промиса
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //result обработчика then
    console.log(res.body.message); //result of the API call

    await writeFilePro('dog-img.txt', res.body.message); //не сохраняем в переменную, поскольку не возвращает важного значения
    console.log('Random dog image saved to file');
  } catch (err) {
    //в случае ошибки, выход из блока try и сработает блок в catch и у него будет доступ к error-у
    console.log(err);
    throw err; //пометит целую функцию промиса как отклоненныи (rejected)
  }
  return '2: Ready!';
};

/*
console.log('1: Will get dog pics!');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dog pics!');
  })
  .catch((err) => {
    console.log('ERROR');
  });
*/
/*
readFilePro(`${__dirname}/dog.txt`) //1 промис
  .then((data) => {
    //передаем имя файла, возвращает промис. На нем используем метод then. data - то что мы вернули из промиса в случае успеха (resolve), можно дать другое имя
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`); //метод гет возвращает промис //2 промис
  })
  .then((res) => {
    //handler the (метод then) вызовется когда гет закончит свою работу. then вызывается при успехе
    console.log(res.body.message);

    return writeFilePro('dog-img.txt', res.body.message); //3 промис
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch((err) => {
    //метод catch вызывается только в случае ошибки //в нашем случае только один метод catch на 3 промиса
    console.log(err); //берет err из reject
  });
*/
