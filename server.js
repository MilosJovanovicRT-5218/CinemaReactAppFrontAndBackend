const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Postavke za parsiranje JSON podataka
app.use(express.json());
app.use(cors());

// Učitavanje podataka iz JSON fajla
const loadData = () => {
  const data = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(data);
};

// Spremanje podataka u JSON fajl
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
};

app.get('/', (req, res) => {
  res.send('Server radi!!!');
});

// Ruta za dobavljanje svih filmova
app.get('/filmovi', (req, res) => {
  const data = loadData();
  res.json(data.filmovi);
});

// Ruta za dodavanje novog filma
app.post('/filmovi', (req, res) => {
  const data = loadData();
  const noviFilm = req.body;
  data.filmovi.push(noviFilm);
  saveData(data);
  res.json(noviFilm);
});

// Ruta za brisanje filma
app.delete('/filmovi/:nazivFilma', (req, res) => {
  const { nazivFilma } = req.params;
  const data = loadData();

  const index = data.filmovi.findIndex((film) => film.naziv === nazivFilma);

  if (index === -1) {
    return res.status(404).json({ error: 'Film not found' });
  }

  data.filmovi.splice(index, 1);
  saveData(data);

  res.json({ message: 'Film deleted' });
});

// Ruta za ažuriranje filma
app.put('/filmovi/:nazivFilma', (req, res) => {
  const data = loadData();
  const { nazivFilma } = req.params;
  const updatedFilm = req.body;

  const film = data.filmovi.find((film) => film.naziv === nazivFilma);
  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  film.naziv = updatedFilm.naziv;
  film.is3D = updatedFilm.is3D; // Ažuriranje polja za 3D tehnologiju
  saveData(data);
  res.json(film);
});

// Ruta za brisanje filma
app.delete('/filmovi/:nazivFilma', (req, res) => {
  const { nazivFilma } = req.params;
  const data = loadData();

  const index = data.filmovi.findIndex((film) => film.naziv === nazivFilma);

  if (index === -1) {
    return res.status(404).json({ error: 'Film not found' });
  }

  data.filmovi.splice(index, 1);
  saveData(data);

  res.json({ message: 'Film deleted' });
});

// Ruta za dobavljanje svih sala
app.get('/sale', (req, res) => {
  const data = loadData();
  res.json(data.sale);
});

// Ruta za dodavanje nove sale
app.post('/sale', (req, res) => {
  const data = loadData();
  const novaSala = req.body;
  data.sale.push(novaSala);
  saveData(data);
  res.json(novaSala);
});

////////////
// Ruta za izmenu sale na osnovu ID-a
app.put('/sale/:id', (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const updatedSala = req.body;

  const sala = data.sale.find((sala) => sala.id === parseInt(id));
  if (!sala) {
    return res.status(404).json({ error: 'Sala not found' });
  }

  sala.naziv = updatedSala.naziv;
  sala.kapacitet = updatedSala.kapacitet;
  saveData(data);
  res.json(sala);
});

// Ruta za brisanje sale
app.delete('/sale/:nazivSale', (req, res) => {
  const { nazivSale } = req.params;
  const data = loadData();

  const index = data.sale.findIndex((sala) => sala.naziv === nazivSale);

  if (index === -1) {
    return res.status(404).json({ error: 'Sala not found' });
  }

  data.sale.splice(index, 1);
  saveData(data);

  res.json({ message: 'Sala deleted' });
});
//////////////////////////////////////////////////
app.delete('/rezervacije/:id', (req, res) => {
  const { id } = req.params;
  const data = loadData();

  const index = data.rezervacije.findIndex((rezervacija) => rezervacija.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Rezervacija nije pronađena.' });
  }

  data.rezervacije.splice(index, 1);
  saveData(data);

  res.json({ message: 'Rezervacija uspešno obrisana.' });
});

// Ruta za dobavljanje svih projekcija
app.get('/projekcije', (req, res) => {
  const data = loadData();
  res.json(data.projekcije);
});

// Ruta za dodavanje nove projekcije
app.post('/projekcije', (req, res) => {
  const data = loadData();
  const novaProjekcija = req.body;
  data.projekcije.push(novaProjekcija);
  saveData(data);
  res.json(novaProjekcija);
});

// Ruta za izmenu projekcije na osnovu ID-a
// Ruta za izmenu projekcije na osnovu ID-a
app.put('/projekcije/:id', (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const updatedProjekcija = req.body;

  const projekcija = data.projekcije.find((projekcija) => projekcija.id === parseInt(id));
  if (!projekcija) {
    return res.status(404).json({ error: 'Projekcija not found' });
  }

  projekcija.naziv = updatedProjekcija.naziv;
  projekcija.datumVreme = updatedProjekcija.datumVreme;
  projekcija.vreme = updatedProjekcija.vreme;
  projekcija.salaId = updatedProjekcija.salaId;

  saveData(data);
  res.json(projekcija);
});

// Ruta za brisanje projekcije
app.delete('/projekcije/:id', (req, res) => {
  const data = loadData();
  const projekcijaId = req.params.id;

  // Pronalaženje indeksa projekcije koju treba obrisati
  const index = data.projekcije.findIndex((projekcija) => projekcija.id === parseInt(projekcijaId));

  if (index === -1) {
    // Ako projekcija nije pronađena, vraćamo grešku
    return res.status(404).json({ error: 'Projekcija nije pronađena.' });
  }

  // Brisanje projekcije iz niza
  data.projekcije.splice(index, 1);

  // Čuvanje ažuriranih podataka
  saveData(data);

  // Vraćanje uspješne poruke
  res.json({ message: 'Projekcija uspješno obrisana.' });
});

// Ruta za dobavljanje svih rezervacija
app.get('/rezervacije', (req, res) => {
  const data = loadData();
  res.json(data.rezervacije);
});

// Ruta za dodavanje nove rezervacije
app.post('/rezervacije', (req, res) => {
  const data = loadData();
  const novaRezervacija = req.body;
  data.rezervacije.push(novaRezervacija);
  saveData(data);
  res.json(novaRezervacija);
});

// Ruta za izmenu rezervacije na osnovu ID-a
app.put('/rezervacije/:id', (req, res) => {
  const data = loadData();
  const { id } = req.params;
  const updatedRezervacija = req.body;

  const rezervacija = data.rezervacije.find((rezervacija) => rezervacija.id === parseInt(id));
  if (!rezervacija) {
    return res.status(404).json({ error: 'Rezervacija not found' });
  }

  rezervacija.projekcijaId = updatedRezervacija.projekcijaId;
  rezervacija.email = updatedRezervacija.email;
  rezervacija.nazivSale = updatedRezervacija.nazivSale;
  rezervacija.datum = updatedRezervacija.datum;
  rezervacija.vreme = updatedRezervacija.vreme;

  saveData(data);
  res.json(rezervacija);
});

// Ruta za filtriranje projekcija
app.get('/projekcije/filtriraj', (req, res) => {
  const data = loadData();
  const { filmId, salaId } = req.query;

  let filteredProjekcije = data.projekcije;
  if (filmId) {
    filteredProjekcije = filteredProjekcije.filter((projekcija) => projekcija.filmId === parseInt(filmId));
  }
  if (salaId) {
    filteredProjekcije = filteredProjekcije.filter((projekcija) => projekcija.salaId === parseInt(salaId));
  }

  res.json(filteredProjekcije);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server je pokrenut na portu ${port}`);
}); 

//Ruta za brisanje

// Ruta za brisanje rezervacije
///OVOOOOOO
// Ruta za brisanje rezervacije na osnovu projekcijaId i email-a
/*




// Ruta za brisanje rezervacije na osnovu projekcijaId i email-a
app.delete('/projekcije/:id', (req, res) => {
  const { id } = req.params;
  const data = loadData();

  const index = data.projekcije.findIndex((projekcija) => projekcija.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Projekcija not found' });
  }

  data.projekcije.splice(index, 1);
  saveData(data);

  res.json({ message: 'Projekcija deleted' });
});




*/

/*
app.delete('/rezervacije/:id', (req, res) => {
  const data = loadData();
  const rezervacijaId = parseInt(req.params.id);

  const index = data.rezervacije.findIndex((rezervacija) => rezervacija.id === rezervacijaId);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  data.rezervacije.splice(index, 1);
  saveData(data);
  res.json({ message: 'Reservation deleted' });
});
*/

// Pokretanje servera

/*
const express = require('express');
const fs = require('fs');

const app = express();

// Postavke za parsiranje JSON podataka
app.use(express.json());

// Učitavanje podataka iz JSON fajla
const loadData = () => {
  const data = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(data);
};

// Spremanje podataka u JSON fajl
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
};

// Ruta za dobavljanje svih filmova
app.get('/filmovi', (req, res) => {
  const data = loadData();
  res.json(data.filmovi);
});

// Ruta za dodavanje novog filma
app.post('/filmovi', (req, res) => {
  const data = loadData();
  const noviFilm = req.body;
  data.filmovi.push(noviFilm);
  saveData(data);
  res.json(noviFilm);
});

// Ruta za dobavljanje svih sala
app.get('/sale', (req, res) => {
  const data = loadData();
  res.json(data.sale);
});

// Ruta za dodavanje nove sale
app.post('/sale', (req, res) => {
  const data = loadData();
  const novaSala = req.body;
  data.sale.push(novaSala);
  saveData(data);
  res.json(novaSala);
});

// Ruta za dobavljanje svih projekcija
app.get('/projekcije', (req, res) => {
  const data = loadData();
  res.json(data.projekcije);
});

// Ruta za dodavanje nove projekcije
app.post('/projekcije', (req, res) => {
  const data = loadData();
  const novaProjekcija = req.body;
  data.projekcije.push(novaProjekcija);
  saveData(data);
  res.json(novaProjekcija);
});

// Ruta za dobavljanje svih rezervacija
app.get('/rezervacije', (req, res) => {
  const data = loadData();
  res.json(data.rezervacije);
});

// Ruta za dodavanje nove rezervacije
app.post('/rezervacije', (req, res) => {
  const data = loadData();
  const novaRezervacija = req.body;
  data.rezervacije.push(novaRezervacija);
  saveData(data);
  res.json(novaRezervacija);
});

// Pokretanje servera
const port = 3000;
app.listen(port, () => {
  console.log(`Server je pokrenut na portu ${port}`);
});
*/










/*
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Postavke za parsiranje JSON podataka
app.use(express.json());
app.use(cors());

// Učitavanje podataka iz JSON fajla
const loadData = () => {
  const data = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(data);
};

// Spremanje podataka u JSON fajl
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
};

app.get('/', (req, res) => {
  res.send('Server radi!!!');
});

// Ruta za dobavljanje svih filmova
app.get('/filmovi', (req, res) => {
  const data = loadData();
  res.json(data.filmovi);
});

// Ruta za dodavanje novog filma
app.post('/filmovi', (req, res) => {
  const data = loadData();
  const noviFilm = req.body;
  data.filmovi.push(noviFilm);
  saveData(data);
  res.json(noviFilm);
});

// Ruta za brisanje filma
app.delete('/filmovi/:id', (req, res) => {
  const data = loadData();
  const filmId = parseInt(req.params.id);

  const index = data.filmovi.findIndex((film) => film.id === filmId);
  if (index === -1) {
    return res.status(404).json({ error: 'Film not found' });
  }

  data.filmovi.splice(index, 1);
  saveData(data);
  res.json({ message: 'Film deleted' });
});

// Ruta za ažuriranje filma
app.put('/filmovi/:id', (req, res) => {
  const data = loadData();
  const filmId = parseInt(req.params.id);
  const updatedFilm = req.body;

  const film = data.filmovi.find((film) => film.id === filmId);
  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  film.naziv = updatedFilm.naziv;
  film.tehnologija = updatedFilm.tehnologija;
  saveData(data);
  res.json(film);
});

// Ruta za dobavljanje svih sala
app.get('/sale', (req, res) => {
  const data = loadData();
  res.json(data.sale);
});

// Ruta za dodavanje nove sale
app.post('/sale', (req, res) => {
  const data = loadData();
  const novaSala = req.body;
  data.sale.push(novaSala);
  saveData(data);
  res.json(novaSala);
});

// Ruta za dobavljanje svih projekcija
app.get('/projekcije', (req, res) => {
  const data = loadData();
  res.json(data.projekcije);
});

// Ruta za dodavanje nove projekcije
app.post('/projekcije', (req, res) => {
  const data = loadData();
  const novaProjekcija = req.body;
  data.projekcije.push(novaProjekcija);
  saveData(data);
  res.json(novaProjekcija);
});

// Ruta za dobavljanje svih rezervacija
app.get('/rezervacije', (req, res) => {
  const data = loadData();
  res.json(data.rezervacije);
});

// Ruta za dodavanje nove rezervacije
app.post('/rezervacije', (req, res) => {
  const data = loadData();
  const novaRezervacija = req.body;
  data.rezervacije.push(novaRezervacija);
  saveData(data);
  res.json(novaRezervacija);
});

// Ruta za filtriranje projekcija
app.get('/projekcije/filtriraj', (req, res) => {
  const data = loadData();
  const { filmId, salaId } = req.query;

  let filteredProjekcije = data.projekcije;
  if (filmId) {
    filteredProjekcije = filteredProjekcije.filter((projekcija) => projekcija.filmId === parseInt(filmId));
  }
  if (salaId) {
    filteredProjekcije = filteredProjekcije.filter((projekcija) => projekcija.salaId === parseInt(salaId));
  }

  res.json(filteredProjekcije);
});

// Pokretanje servera
const port = 3001;
app.listen(port, () => {
  console.log(`Server je pokrenut na portu ${port}`);
});
*/