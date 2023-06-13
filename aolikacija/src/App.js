import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [films, setFilms] = useState([]);
  const [nazivFilma, setNazivFilma] = useState('');
  const [is3D, setIs3D] = useState(false);
  const [sale, setSale] = useState([]);
  const [nazivSale, setNazivSale] = useState('');
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [selectedSalaId, setSelectedSalaId] = useState('');
  const [selectedDatumVreme, setSelectedDatumVreme] = useState('');
  const [cena, setCene] = useState('');
  const [kapacitetSale, setKapacitetSale] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProjekcijaId, setSelectedProjekcijaId] = useState('');

  useEffect(() => {
    fetchFilms();
    fetchSale();
    fetchProjekcije();
    fetchRezervacije();
  }, []);

  
// Funkcija za sortiranje filmova od A do Z
const sortFilmoviAZ = () => {
  const sortedFilmovi = [...films].sort((a, b) => a.naziv.localeCompare(b.naziv));
  setFilms(sortedFilmovi);
};

// Funkcija za sortiranje filmova od Z do A
const sortFilmoviZA = () => {
  const sortedFilmovi = [...films].sort((a, b) => b.naziv.localeCompare(a.naziv));
  setFilms(sortedFilmovi);
};

  // Funkcija za brisanje filma
  const handleDeleteFilm = (nazivFilma) => {
    axios
      .delete(`http://localhost:3001/filmovi/${nazivFilma}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste filmova nakon brisanja
        setFilms(films.filter((film) => film.naziv !== nazivFilma));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje filma
 // Funkcija za dodavanje filma
const handleAddFilm = () => {
  if (!nazivFilma) {
    alert('Unesite naziv filma.'); // Dodajte obaveštenje korisniku da je polje obavezno
    return;
  }

  axios
    .post('http://localhost:3001/filmovi', { naziv: nazivFilma, is3D: is3D })
    .then((res) => {
      console.log('ADDED RECORD:', res);
      // Ažuriranje liste filmova nakon dodavanja
      setFilms([...films, { naziv: nazivFilma, is3D: is3D }]);
      // Resetovanje polja za unos
      setNazivFilma('');
      setIs3D(false);
    })
    .catch((err) => console.log(err));
};

  // Funkcija za brisanje sale
  const handleDeleteSale = (nazivSale) => {
    axios
      .delete(`http://localhost:3001/sale/${nazivSale}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste sala nakon brisanja
        setSale(sale.filter((sala) => sala.naziv !== nazivSale));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje sale
  const handleAddSale = () => {
    if (!nazivSale || !kapacitetSale) {
      alert('Unesite naziv sale i kapacitet.'); // Dodajte obaveštenje korisniku da su polja obavezna
      return;
    }
  
    axios
      .post('http://localhost:3001/sale', { naziv: nazivSale, kapacitet: kapacitetSale })
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste sala nakon dodavanja
        setSale([...sale, { naziv: nazivSale, kapacitet: kapacitetSale }]);
        // Resetovanje polja za unos
        setNazivSale('');
        setKapacitetSale('');
      })
      .catch((err) => console.log(err));
  };

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36); // Trenutno vreme u baznom 36 formatu
    const randomNum = Math.floor(Math.random() * 1000).toString(36); // Nasumičan broj između 0 i 999 u baznom 36 formatu
    
    return timestamp + randomNum; // Spajanje vremena i nasumičnog broja
  };

// Funkcija za dodavanje projekcije
const handleAddProjekcija = () => {
  if (!selectedFilmId || !selectedSalaId || !cena || !selectedDatumVreme) {
    alert('Unesite sve neophodne podatke.');
    return;
  }

  const novaProjekcija = {
    id: generateUniqueId(), // Generisanje jedinstvenog ID-a za projekciju
    filmId: selectedFilmId,
    salaId: selectedSalaId,
    cena: cena,
    datumVreme: selectedDatumVreme
  };

  axios
    .post('http://localhost:3001/projekcije', novaProjekcija)
    .then((res) => {
      console.log('ADDED RECORD:', res);
      setProjekcije([...projekcije, novaProjekcija]);
      setSelectedFilmId('');
      setSelectedSalaId('');
      setSelectedDatumVreme('');
      setCene('');
    })
    .catch((err) => console.log(err));
};

  // Funkcija za dodavanje rezervacije
  // Funkcija za dodavanje rezervacije
  const handleAddRezervacija = () => {
    if (!selectedProjekcijaId || !email) {
      alert('Unesite sve neophodne podatke.'); // Dodajte obaveštenje korisniku da su polja obavezna
      return;
    }
  
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Regex za proveru ispravnosti email adrese
  
    if (!emailRegex.test(email)) {
      alert('Unesite validnu email adresu.'); // Dodajte obaveštenje korisniku da unese validnu email adresu
      return;
    }
  
    const novaRezervacija = {
      projekcijaId: selectedProjekcijaId, // Odabrani ID projekcije
      email: email // Uneti email
    };
  
    axios
      .post('http://localhost:3001/rezervacije', novaRezervacija)
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste rezervacija nakon dodavanja
        setRezervacije([...rezervacije, novaRezervacija]);
        // Resetovanje polja za unos
        setSelectedProjekcijaId('');
        setEmail('');
      })
      .catch((err) => console.log(err));
  };
  

  // Dobavljanje liste filmova
  const fetchFilms = () => {
    axios
      .get('http://localhost:3001/filmovi')
      .then((res) => {
        setFilms(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste sala
  const fetchSale = () => {
    axios
      .get('http://localhost:3001/sale')
      .then((res) => {
        setSale(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste projekcija
  const fetchProjekcije = () => {
    axios
      .get('http://localhost:3001/projekcije')
      .then((res) => {
        setProjekcije(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste rezervacija
  const fetchRezervacije = () => {
    axios
      .get('http://localhost:3001/rezervacije')
      .then((res) => {
        setRezervacije(res.data);
      })
      .catch((err) => console.log(err));
  };
/////////////////////////////////////////////////////
  // Funkcija za izmenu filma
  const handleUpdateFilm = (nazivFilma, novoIme) => {
    axios
      .put(`http://localhost:3001/filmovi/${nazivFilma}`, { naziv: novoIme })
      .then((res) => {
        console.log('UPDATED RECORD:', res);
        // Ažuriranje liste filmova nakon izmene
        setFilms(films.map((film) => {
          if (film.naziv === nazivFilma) {
            return { ...film, naziv: novoIme };
          }
          return film;
        }));
      })
      .catch((err) => console.log(err));
  };

  // Prikaz liste filmova
  const renderFilms = () => {
    return films.map((film) => (
      <div id = "div3" key={film.naziv} >
        <span>{film.naziv} - {film.is3D ? '3D' : '2D'}</span>
        &nbsp; &nbsp; &nbsp;
        <button  id = "btn" onClick={() => handleDeleteFilm(film.naziv)}>Delete</button>
        <input
          type="text"
          placeholder='New Name'
          value={film.naziv}
          onChange={(e) => handleUpdateFilm(film.naziv, e.target.value)}
        />
      </div>
    ));
  };
//////////////////////////////////////
// Funkcija za izmenu sale
// Funkcija za izmenu sale
const handleUpdateSale = (id, novoNaziv) => {
  axios
    .put(`http://localhost:3001/sale/${id}`, { naziv: novoNaziv })
    .then((res) => {
      console.log('UPDATED RECORD:', res);
      // Ažuriranje liste sala nakon izmene
      setSale(sale.map((sala) => {
        if (sala.id === id) {
          return { ...sala, naziv: novoNaziv };
        }
        return sala;
      }));
    })
    .catch((err) => console.log(err));
};


  // Prikaz liste sala
  const renderSale = () => {
    return sale.map((sala) => (
      <div id = "div3" key={sala.naziv}>
        <span>{sala.naziv}</span>

        &nbsp; &nbsp; &nbsp;
        <span>Mesta:</span> &nbsp; &nbsp; &nbsp;
        <span>{sala.kapacitet}</span>
        <button id = "btn" onClick={() => handleDeleteSale(sala.naziv)}>Delete</button>
        <input
        type="text"
        placeholder="New Name"
        value={sala.naziv}
        onChange={(e) => handleUpdateSale(sala.id, e.target.value)}
      />
      </div>
    ));
  };

//////////////////////////////////////////////////////////////////////////////////////////

// Funkcija za brisanje projekcije
const handleDeleteProjekcija = (id) => {
  axios
    .delete(`http://localhost:3001/projekcije/${id}`)
    .then((res) => {
      console.log('DELETED RECORD:', res);
      // Ažuriranje liste projekcija nakon brisanja
      setProjekcije(projekcije.filter((projekcija) => projekcija.id !== id));
    })
    .catch((err) => console.log(err));
};

// Funkcija za izmenu projekcije
const handleUpdateProjekcija = (id, novoDatumVreme) => {
  axios
    .put(`http://localhost:3001/projekcije/${id}`, { datumVreme: novoDatumVreme })
    .then((res) => {
      console.log('UPDATED RECORD:', res);
      // Update the projections list after the update
      setProjekcije(projekcije.map((projekcija) => {
        if (projekcija.id === id) {
          return { ...projekcija, datumVreme: novoDatumVreme };
        }
        return projekcija;
      }));
    })
    .catch((err) => console.log(err));
};

  // Prikaz liste projekcija
  const renderProjekcije = () => {
    return projekcije.map((projekcija) => (
      <div id = "div3" key={projekcija.id}>
        <span>ID projekcije: {projekcija.id}</span>
        &nbsp; &nbsp; &nbsp;
        <span>Film: {projekcija.filmId}</span>
        &nbsp; &nbsp; &nbsp;
        <span>Sala: {projekcija.salaId}</span>
        &nbsp; &nbsp; &nbsp;
        <span>Vreme: {projekcija.datumVreme}</span>
        &nbsp; &nbsp; &nbsp;
        <span>Cena: {projekcija.cena}</span> {/* Display the cena field */}
        <input
        type="text"
        placeholder="New Date and Time"
        value={projekcija.datumVreme}
        onChange={(e) => handleUpdateProjekcija(projekcija.id, e.target.value)}
      />
       <button onClick={() => handleDeleteProjekcija(projekcija.id)}>Delete</button>
      </div>
    ));
  };
/////////////////////////////////////////////////////////////////////////////////////////////////
// Funkcija za brisanje rezervacije
const handleDeleteRezervacija = (id) => {
  axios
    .delete(`http://localhost:3001/rezervacije/${id}`)
    .then((res) => {
      console.log('DELETED RECORD:', res);
      // Ažuriranje liste rezervacija nakon brisanja
      setRezervacije(rezervacije.filter((rezervacija) => rezervacija.id !== id));
    })
    .catch((err) => console.log(err));
};
// Funkcija za izmenu rezervacije
const handleUpdateRezervacija = (id, noviEmail) => {
  axios
    .put(`http://localhost:3001/rezervacije/${id}`, { email: noviEmail })
    .then((res) => {
      console.log('UPDATED RECORD:', res);
      // Ažuriranje liste rezervacija nakon izmene
      setRezervacije(rezervacije.map((rezervacija) => {
        if (rezervacija.id === id) {
          return { ...rezervacija, email: noviEmail };
        }
        return rezervacija;
      }));
    })
    .catch((err) => console.log(err));
};



  // Prikaz liste rezervacija
  const renderRezervacije = () => {
    return rezervacije.map((rezervacija) => (
      <div id = "div3" key={rezervacija.id}>
        <span>ID Projekcije: {rezervacija.projekcijaId}</span>
        &nbsp; &nbsp; &nbsp;
        <span>Email : {rezervacija.email}</span>
        <input
        type="text"
        placeholder="Novi Email"
        value={rezervacija.email}
        onChange={(e) => handleUpdateRezervacija(rezervacija.id, e.target.value)}
      />
      <button onClick={() => handleDeleteRezervacija(rezervacija.id)}>Delete</button>
      </div>
    ));
  };

  return (
    <div id="background">
      <h1>Filmovi</h1>

      <label>
        Naziv filma:
        <br></br>
        <input
          type="text"
          placeholder='Ime filma'
          value={nazivFilma}
          onChange={(e) => setNazivFilma(e.target.value)}
        />
      </label>
      <label>
        3D:
        <input
          type="checkbox"
          checked={is3D}
          onChange={(e) => setIs3D(e.target.checked)}
        />
      </label>
      <div id = "div9">
      <button id = "btn" onClick={handleAddFilm}>Dodaj film</button>
      <button id = "btn"onClick={sortFilmoviAZ}>Sortiraj od A do Z</button>
      <button id = "btn"onClick={sortFilmoviZA}>Sortiraj od Z do A</button>
      </div>

      {renderFilms()}

      <h1>Sale</h1>

      <label>
        Naziv sale:
        <br></br>
        <input 
          type="text"
          placeholder='Naziv sale'
          value={nazivSale}
          onChange={(e) => setNazivSale(e.target.value)}
        />
      </label>
      <label>
        Kapacitet sale:
        <br></br>
        <input
          type="number"
          placeholder='Kapacitet sale'
          value={kapacitetSale}
          onChange={(e) => setKapacitetSale(e.target.value)}
        />
      </label>
      <br></br>
      <button onClick={handleAddSale}>Dodaj salu</button>

      {renderSale()}

      <h1>Projekcije</h1>

      <label>
        Film:
        <select value={selectedFilmId} onChange={(e) => setSelectedFilmId(e.target.value)}>
          <option value="">Izaberite film</option>
          {films.map((film) => (
            <option key={film.naziv} value={film.id}>
              {film.naziv}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sala:
        <select value={selectedSalaId} onChange={(e) => setSelectedSalaId(e.target.value)}>
          <option value="">Izaberite salu</option>
          {sale.map((sala) => (
            <option key={sala.naziv} value={sala.id}>
              {sala.naziv}
            </option>
          ))}
        </select>
      </label>

      <label>
        Datum i vreme:
        <br></br>
        <input
          type="datetime-local"
          value={selectedDatumVreme}
          onChange={(e) => setSelectedDatumVreme(e.target.value)}
        />
      </label>

      <label>
        Cena:
        <br></br>
        <input
          type="number"
          value={cena}
          placeholder='Cena karte'
          onChange={(e) => setCene(e.target.value)}
        />
      </label>
      <br></br>
      <button onClick={handleAddProjekcija}>Dodaj projekciju</button>

      {renderProjekcije()}

      <h1>Rezervacije</h1>

      <label>
        Projekcija:
        <br></br>
        <select value={selectedProjekcijaId} onChange={(e) => setSelectedProjekcijaId(e.target.value)}>
          <option value="">Izaberite ID projekcije</option>
          {projekcije.map((projekcija) => (
            <option key={projekcija.id} value={projekcija.id}>
              {projekcija.id}
            </option>
          ))}
        </select>
      </label>

      <label>
        Email:
        <br></br>
        <input placeholder='example@gmail.com'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br></br>
      <button  onClick={handleAddRezervacija}>Dodaj rezervaciju</button>
      {renderRezervacije()}
    </div>
  );
};

export default App;

/*
 <h1>Rezervacije</h1>

      <button onClick={fetchRezervacije}>Fetch Rezervacije</button>
      {renderRezervacije()}

<button onClick={handleAddSale}>Dodaj salu</button>

      <button onClick={fetchSale}>Fetch Sale</button>
      {renderSale()}

*/

/*

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [films, setFilms] = useState([]);
  const [nazivFilma, setNazivFilma] = useState('');
  const [is3D, setIs3D] = useState(false);
  const [sale, setSale] = useState([]);
  const [nazivSale, setNazivSale] = useState('');
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    fetchFilms();
    fetchSale();
    fetchProjekcije();
    fetchRezervacije();
  }, []);

  // Funkcija za brisanje filma
  const handleDeleteFilm = (nazivFilma) => {
    axios
      .delete(`http://localhost:3001/filmovi/${nazivFilma}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste filmova nakon brisanja
        setFilms(films.filter((film) => film.naziv !== nazivFilma));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje filma
  const handleAddFilm = () => {
    axios
      .post('http://localhost:3001/filmovi', { naziv: nazivFilma, is3D: is3D })
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste filmova nakon dodavanja
        setFilms([...films, { naziv: nazivFilma, is3D: is3D }]);
        // Resetovanje polja za unos
        setNazivFilma('');
        setIs3D(false);
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za brisanje sale
  const handleDeleteSale = (nazivSale) => {
    axios
      .delete(`http://localhost:3001/sale/${nazivSale}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste sala nakon brisanja
        setSale(sale.filter((sala) => sala.naziv !== nazivSale));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje sale
  const handleAddSale = () => {
    axios
      .post('http://localhost:3001/sale', { naziv: nazivSale })
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste sala nakon dodavanja
        setSale([...sale, { naziv: nazivSale }]);
        // Resetovanje polja za unos
        setNazivSale('');
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste filmova
  const fetchFilms = () => {
    axios
      .get('http://localhost:3001/filmovi')
      .then((res) => {
        setFilms(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste sala
  const fetchSale = () => {
    axios
      .get('http://localhost:3001/sale')
      .then((res) => {
        setSale(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste projekcija
  const fetchProjekcije = () => {
    axios
      .get('http://localhost:3001/projekcije')
      .then((res) => {
        setProjekcije(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste rezervacija
  const fetchRezervacije = () => {
    axios
      .get('http://localhost:3001/rezervacije')
      .then((res) => {
        setRezervacije(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Prikaz liste filmova
  const renderFilms = () => {
    return films.map((film) => (
      <div key={film.naziv}>
        <span>{film.naziv} - {film.is3D ? '3D' : '2D'}</span>
        <button onClick={() => handleDeleteFilm(film.naziv)}>Delete</button>
      </div>
    ));
  };

  // Prikaz liste sala
  const renderSale = () => {
    return sale.map((sala) => (
      <div key={sala.naziv}>
        <span>{sala.naziv}</span>
        <button onClick={() => handleDeleteSale(sala.naziv)}>Delete</button>
      </div>
    ));
  };

  // Prikaz liste projekcija
  const renderProjekcije = () => {
    return projekcije.map((projekcije) => (
      <div key={projekcije.id}>
        <span>Film: {projekcije.filmId}</span>
        <span>Sala: {projekcije.salaId}</span>
        <span>Vreme: {projekcije.datumVreme}</span>
      </div>
    ));
  };

  // Prikaz liste rezervacija
  const renderRezervacije = () => {
    return rezervacije.map((rezervacija) => (
      <div key={rezervacija.id}>
        <span>Projekcija: {rezervacija.projekcijaId}</span>
        <span>Email: {rezervacija.email}</span>
      </div>
    ));
  };

  return (
    <div>
      <h1>Filmovi</h1>

      <label>
        Naziv filma:
        <input
          type="text"
          value={nazivFilma}
          onChange={(e) => setNazivFilma(e.target.value)}
        />
      </label>
      <label>
        3D:
        <input
          type="checkbox"
          checked={is3D}
          onChange={(e) => setIs3D(e.target.checked)}
        />
      </label>
      <button onClick={handleAddFilm}>Dodaj film</button>

      <button onClick={fetchFilms}>Fetch Films</button>
      {renderFilms()}

      <h1>Sale</h1>

      <label>
        Naziv sale:
        <input
          type="text"
          value={nazivSale}
          onChange={(e) => setNazivSale(e.target.value)}
        />
      </label>
      <button onClick={handleAddSale}>Dodaj salu</button>

      <button onClick={fetchSale}>Fetch Sale</button>
      {renderSale()}

      <h1>Projekcije</h1>

      <button onClick={fetchProjekcije}>Fetch Projekcije</button>
      {renderProjekcije()}

      <h1>Rezervacije</h1>

      <button onClick={fetchRezervacije}>Fetch Rezervacije</button>
      {renderRezervacije()}
    </div>
  );
};

export default App;


*/

//OVO
/*
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [films, setFilms] = useState([]);
  const [nazivFilma, setNazivFilma] = useState('');
  const [is3D, setIs3D] = useState(false);
  const [sale, setSale] = useState([]);
  const [nazivSale, setNazivSale] = useState('');

  // Funkcija za brisanje filma
  const handleDeleteFilm = (nazivFilma) => {
    axios
      .delete(`http://localhost:3001/filmovi/${nazivFilma}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste filmova nakon brisanja
        setFilms(films.filter((film) => film.naziv !== nazivFilma));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje filma
  const handleAddFilm = () => {
    axios
      .post('http://localhost:3001/filmovi', { naziv: nazivFilma, is3D: is3D })
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste filmova nakon dodavanja
        setFilms([...films, { naziv: nazivFilma, is3D: is3D }]);
        // Resetovanje polja za unos
        setNazivFilma('');
        setIs3D(false);
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za brisanje sale
  const handleDeleteSale = (nazivSale) => {
    axios
      .delete(`http://localhost:3001/sale/${nazivSale}`)
      .then((res) => {
        console.log('DELETED RECORD:', res);
        // Ažuriranje liste sala nakon brisanja
        setSale(sale.filter((sala) => sala.naziv !== nazivSale));
      })
      .catch((err) => console.log(err));
  };

  // Funkcija za dodavanje sale
  const handleAddSale = () => {
    axios
      .post('http://localhost:3001/sale', { naziv: nazivSale })
      .then((res) => {
        console.log('ADDED RECORD:', res);
        // Ažuriranje liste sala nakon dodavanja
        setSale([...sale, { naziv: nazivSale }]);
        // Resetovanje polja za unos
        setNazivSale('');
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste filmova
  const fetchFilms = () => {
    axios
      .get('http://localhost:3001/filmovi')
      .then((res) => {
        setFilms(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Dobavljanje liste sala
  const fetchSale = () => {
    axios
      .get('http://localhost:3001/sale')
      .then((res) => {
        setSale(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Prikaz liste filmova
  const renderFilms = () => {
    return films.map((film) => (
      <div key={film.naziv}>
        <span>{film.naziv} - {film.is3D ? '3D' : '2D'}</span>
        <button onClick={() => handleDeleteFilm(film.naziv)}>Delete</button>
      </div>
    ));
  };

  // Prikaz liste sala
  const renderSale = () => {
    return sale.map((sala) => (
      <div key={sala.naziv}>
        <span>{sala.naziv}</span>
        <button onClick={() => handleDeleteSale(sala.naziv)}>Delete</button>
      </div>
    ));
  };

  return (
    <div>
      <h1>Filmovi</h1>

      <label>
        Naziv filma:
        <input
          type="text"
          value={nazivFilma}
          onChange={(e) => setNazivFilma(e.target.value)}
        />
      </label>
      <label>
        3D:
        <input
          type="checkbox"
          checked={is3D}
          onChange={(e) => setIs3D(e.target.checked)}
        />
      </label>
      <button onClick={handleAddFilm}>Dodaj film</button>

      <button onClick={fetchFilms}>Fetch Films</button>
      {renderFilms()}

      <h1>Sale</h1>

      <label>
        Naziv sale:
        <input
          type="text"
          value={nazivSale}
          onChange={(e) => setNazivSale(e.target.value)}
        />
      </label>
      <button onClick={handleAddSale}>Dodaj salu</button>

      <button onClick={fetchSale}>Fetch Sale</button>
      {renderSale()}
    </div>
  );
};

export default App;
*/










/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [filmovi, setFilmovi] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacija, setRezervacija] = useState({ projekcijaId: '', email: '' });
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filmoviResponse, projekcijeResponse, rezervacijeResponse] = await Promise.all([
        axios.get('http://localhost:3001/filmovi'),
        axios.get('http://localhost:3001/projekcije'),
        axios.get('http://localhost:3001/rezervacije')
      ]);

      setFilmovi(filmoviResponse.data);
      setProjekcije(projekcijeResponse.data);
      setRezervacije(rezervacijeResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/rezervacije', rezervacija);
      setRezervacija({ projekcijaId: '', email: '' });
      fetchData();
      alert('Rezervacija uspešno napravljena!');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <h1>Rezervacija Karata</h1>

      <h2>Filmovi</h2>
      <ul>
        {filmovi.map((film) => (
          <li key={film.id}>{film.naziv}</li>
        ))}
      </ul>

      <h2>Projekcije</h2>
      <ul>
        {projekcije.map((projekcija) => (
          <li key={projekcija.id}>
            {projekcija.film} - Cena: {projekcija.cena} - Datum i vreme: {projekcija.datumVreme}
          </li>
        ))}
      </ul>

      <h2>Rezervacije</h2>
      <ul>
        {rezervacije.map((rezervacija) => (
          <li key={rezervacija.id}>
            Projekcija: {rezervacija.projekcijaId} - Email: {rezervacija.email}
          </li>
        ))}
      </ul>

      <h2>Rezervacija</h2>
      <form onSubmit={handleReservation}>
        <label>
          Projekcija:
          <select
            value={rezervacija.projekcijaId}
            onChange={(e) => setRezervacija({ ...rezervacija, projekcijaId: e.target.value })}
          >
            <option value="">Izaberite projekciju</option>
            {projekcije.map((projekcija) => (
              <option key={projekcija.id} value={projekcija.id}>
                {projekcija.film} - Cena: {projekcija.cena} - Datum i vreme: {projekcija.datumVreme}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          E-mail:
          <input
            type="email"
            value={rezervacija.email}
            onChange={(e) => setRezervacija({ ...rezervacija, email: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Rezerviši kartu</button>
      </form>
    </div>
  );
};

export default App;
*/



///








/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [filmovi, setFilmovi] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacija, setRezervacija] = useState({ projekcijaId: '', email: '' });
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filmoviResponse, projekcijeResponse, rezervacijeResponse] = await Promise.all([
        axios.get('http://localhost:3001/filmovi'),
        axios.get('http://localhost:3001/projekcije'),
        axios.get('http://localhost:3001/rezervacije')
      ]);

      setFilmovi(filmoviResponse.data);
      setProjekcije(projekcijeResponse.data);
      setRezervacije(rezervacijeResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/rezervacije', rezervacija);
      setRezervacija({ projekcijaId: '', email: '' });
      fetchData();
      alert('Rezervacija uspešno napravljena!');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <h1>Rezervacija Karata</h1>

      <h2>Filmovi</h2>
      <ul>
        {filmovi.map((film) => (
          <li key={film.id}>{film.naziv}</li>
        ))}
      </ul>

      <h2>Projekcije</h2>
      <ul>
        {projekcije.map((projekcija) => (
          <li key={projekcija.id}>
            {projekcija.filmId} - {projekcija.datumVreme}
          </li>
        ))}
      </ul>

      <h2>Rezervacije</h2>
      <ul>
        {rezervacije.map((rezervacija) => (
          <li key={rezervacija.id}>
            {rezervacija.projekcijaId} - {rezervacija.email}
          </li>
        ))}
      </ul>

      <h2>Rezervacija</h2>
      <form onSubmit={handleReservation}>
        <label>
          Projekcija:
          <select
            value={rezervacija.projekcijaId}
            onChange={(e) => setRezervacija({ ...rezervacija, projekcijaId: e.target.value })}
          >
            <option value="">Izaberite projekciju</option>
            {projekcije.map((projekcija) => (
              <option key={projekcija.id} value={projekcija.id}>
                {projekcija.filmId} - {projekcija.datumVreme}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          E-mail:
          <input
            type="email"
            value={rezervacija.email}
            onChange={(e) => setRezervacija({ ...rezervacija, email: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Rezerviši kartu</button>
      </form>
    </div>
  );
};

export default App;
*/

///

/*

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [filmovi, setFilmovi] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacija, setRezervacija] = useState({ projekcijaId: '', email: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filmoviResponse, projekcijeResponse] = await Promise.all([
        axios.get('http://localhost:3001/filmovi'),
        axios.get('http://localhost:3001/projekcije')
      ]);

      setFilmovi(filmoviResponse.data);
      setProjekcije(projekcijeResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/rezervacije', rezervacija);
      setRezervacija({ projekcijaId: '', email: '' });
      fetchData();
      alert('Rezervacija uspešno napravljena!');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <h1>Rezervacija Karata</h1>

      <h2>Filmovi</h2>
      <ul>
        {filmovi.map((film) => (
          <li key={film.id}>{film.naziv}</li>
        ))}
      </ul>

      <h2>Projekcije</h2>
      <ul>
        {projekcije.map((projekcija) => (
          <li key={projekcija.id}>
            {projekcija.filmId} - {projekcija.datumVreme}
          </li>
        ))}
      </ul>

      <h2>Rezervacija</h2>
      <form onSubmit={handleReservation}>
        <label>
          Projekcija:
          <select
            value={rezervacija.projekcijaId}
            onChange={(e) => setRezervacija({ ...rezervacija, projekcijaId: e.target.value })}
          >
            <option value="">Izaberite projekciju</option>
            {projekcije.map((projekcija) => (
              <option key={projekcija.id} value={projekcija.id}>
                {projekcija.filmId} - {projekcija.datumVreme}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          E-mail:
          <input
            type="email"
            value={rezervacija.email}
            onChange={(e) => setRezervacija({ ...rezervacija, email: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Rezerviši kartu</button>
      </form>
    </div>
  );
};

export default App;

*/












/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [filmovi, setFilmovi] = useState([]);
  const [sale, setSale] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);

  const [selectedFilmId, setSelectedFilmId] = useState('');
  const [selectedSalaId, setSelectedSalaId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filmoviResponse, saleResponse, projekcijeResponse, rezervacijeResponse] = await Promise.all([
        axios.get('http://localhost:3001/filmovi'),
        axios.get('http://localhost:3001/sale'),
        axios.get('http://localhost:3001/projekcije'),
        axios.get('http://localhost:3001/rezervacije'),
      ]);

      setFilmovi(filmoviResponse.data);
      setSale(saleResponse.data);
      setProjekcije(projekcijeResponse.data);
      setRezervacije(rezervacijeResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilmChange = (event) => {
    setSelectedFilmId(event.target.value);
  };

  const handleSalaChange = (event) => {
    setSelectedSalaId(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleReservationSubmit = async (event) => {
    event.preventDefault();
  
    // Find selected projekcije
    const selectedProjekcije = projekcije.filter(
      (projekcija) =>
        projekcija.filmId === parseInt(selectedFilmId) &&
        projekcija.salaId === parseInt(selectedSalaId)
    );
  
    if (selectedProjekcije.length === 0) {
      console.log('No matching projekcije found.');
      return;
    }
  
    // Create new rezervacije
    const noveRezervacije = selectedProjekcije.map((projekcija) => ({
      projekcijaId: projekcija.id,
      email: email,
    }));
  
    try {
      // Send post requests to create rezervacije
      const rezervacijeResponses = await Promise.all(
        noveRezervacije.map((novaRezervacija) =>
          axios.post('http://localhost:3001/rezervacije', novaRezervacija)
        )
      );
  
      // Add the new rezervacije to the list
      const addedRezervacije = rezervacijeResponses.map((response) => response.data);
      setRezervacije((prevRezervacije) => [...prevRezervacije, ...addedRezervacije]);
  
      // Reset form fields
      setSelectedFilmId('');
      setSelectedSalaId('');
      setEmail('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Filmovi</h1>
      <ul>
        {filmovi.map((film) => (
          <li key={film.naziv}>
            Naziv: {film.naziv}, 3D: {film.is3D.toString()}
          </li>
        ))}
      </ul>

      <h1>Sale</h1>
      <ul>
        {sale.map((sala) => (
          <li key={sala.id}>
            Naziv: {sala.naziv}, Kapacitet: {sala.kapacitet}
          </li>
        ))}
      </ul>

      <h1>Projekcije</h1>
      <ul>
        {projekcije.map((projekcija) => (
          <li key={projekcija.id}>
            Film: {filmovi.find((film) => film.id === projekcija.filmId)?.naziv}, Sala:{' '}
            {sale.find((sala) => sala.id === projekcija.salaId)?.naziv}, Cena: {projekcija.cena}, Datum i vreme:{' '}
            {projekcija.datumVreme}
          </li>
        ))}
      </ul>

      <h1>Rezervacije</h1>
      <ul>
        {rezervacije.map((rezervacija) => (
          <li key={rezervacija.id}>
            Email: {rezervacija.email}, Projekcija: {rezervacija.projekcijaId}
          </li>
        ))}
      </ul>

      <h1>Rezerviši kartu</h1>
      <form onSubmit={handleReservationSubmit}>
        <div>
          <label htmlFor="film">Film:</label>
          <select id="film" value={selectedFilmId} onChange={handleFilmChange}>
            <option value="">Odaberi film</option>
            {filmovi.map((film) => (
              <option key={film.id} value={film.id}>
                {film.naziv}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sala">Sala:</label>
          <select id="sala" value={selectedSalaId} onChange={handleSalaChange}>
            <option value="">Odaberi salu</option>
            {sale.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.naziv}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <button type="submit">Rezerviši</button>
      </form>
    </div>
  );
};

export default App;
*/

///

/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Filmovi = () => {
  const [filmovi, setFilmovi] = useState([]);
  const [naziv, setNaziv] = useState('');
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/filmovi')
      .then((response) => {
        setFilmovi(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDodajFilm = () => {
    const noviFilm = {
      naziv: naziv,
      is3D: is3D
    };

    axios.post('http://localhost:3001/filmovi', noviFilm)
      .then((response) => {
        setFilmovi([...filmovi, response.data]);
        setNaziv('');
        setIs3D(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Filmovi</h1>

      <ul>
        {filmovi.map((film) => (
          <li key={film.id}>
            {film.naziv} - {film.is3D ? '3D' : '2D'}
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Naziv filma"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={is3D}
            onChange={(e) => setIs3D(e.target.checked)}
          />
          3D film
        </label>
        <button onClick={handleDodajFilm}>Dodaj film</button>
      </div>
    </div>
  );
};

export default Filmovi;
*/

///

/*
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [filmovi, setFilmovi] = useState([]);
  const [sale, setSale] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [nazivFilma, setNazivFilma] = useState("");
  const [tehnologijaFilma, setTehnologijaFilma] = useState("");
  const [nazivSale, setNazivSale] = useState("");
  const [kapacitetSale, setKapacitetSale] = useState("");
  const [projekcija, setProjekcija] = useState("");
  const [emailRezervacije, setEmailRezervacije] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("./data.json");
      const data = response.data;
      setFilmovi(data.filmovi);
      setSale(data.sale);
      setProjekcije(data.projekcije);
      setRezervacije(data.rezervacije);
    } catch (error) {
      setError(error);
    }
  };

  const dodajFilm = async () => {
    try {
      const noviFilm = { naziv: nazivFilma, tehnologija: tehnologijaFilma };
      await axios.post("/filmovi", noviFilm);
      fetchData();
      setNazivFilma("");
      setTehnologijaFilma("");
    } catch (error) {
      setError(error);
    }
  };

  const dodajSalu = async () => {
    try {
      const novaSala = { naziv: nazivSale, kapacitet: kapacitetSale };
      await axios.post("/sale", novaSala);
      fetchData();
      setNazivSale("");
      setKapacitetSale("");
    } catch (error) {
      setError(error);
    }
  };

  const dodajProjekciju = async () => {
    try {
      const novaProjekcija = { filmId: projekcija.filmId, salaId: projekcija.salaId };
      await axios.post("/projekcije", novaProjekcija);
      fetchData();
      setProjekcija("");
    } catch (error) {
      setError(error);
    }
  };

  const dodajRezervaciju = async () => {
    try {
      const novaRezervacija = { projekcijaId: projekcija, email: emailRezervacije };
      await axios.post("/rezervacije", novaRezervacija);
      fetchData();
      setEmailRezervacije("");
    } catch (error) {
      setError(error);
    }
  };

  const obrisiFilm = async (id) => {
    try {
      await axios.delete(`/filmovi/${id}`);
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const obrisiSalu = async (id) => {
    try {
      await axios.delete(`/sale/${id}`);
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const obrisiProjekciju = async (id) => {
    try {
      await axios.delete(`/projekcije/${id}`);
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const obrisiRezervaciju = async (id) => {
    try {
      await axios.delete(`/rezervacije/${id}`);
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "nazivFilma") {
      setNazivFilma(e.target.value);
    } else if (e.target.name === "tehnologijaFilma") {
      setTehnologijaFilma(e.target.value);
    } else if (e.target.name === "nazivSale") {
      setNazivSale(e.target.value);
    } else if (e.target.name === "kapacitetSale") {
      setKapacitetSale(e.target.value);
    } else if (e.target.name === "projekcija") {
      setProjekcija(e.target.value);
    } else if (e.target.name === "emailRezervacije") {
      setEmailRezervacije(e.target.value);
    }
  };

  if (error) {
    return <div>Greška prilikom dohvaćanja podataka: {error.message}</div>;
  }

  return (
    <div>
      <h2>Dodaj film</h2>
      <input
        type="text"
        name="nazivFilma"
        placeholder="Naziv filma"
        value={nazivFilma}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tehnologijaFilma"
        placeholder="Tehnologija filma"
        value={tehnologijaFilma}
        onChange={handleChange}
      />
      <button onClick={dodajFilm}>Dodaj film</button>

      <h2>Filmovi</h2>
      {filmovi.map((film) => (
        <div key={film.id}>
          <p>Naziv: {film.naziv}</p>
          <p>Tehnologija: {film.tehnologija}</p>
          <button onClick={() => obrisiFilm(film.id)}>Obriši</button>
        </div>
      ))}

      <h2>Dodaj salu</h2>
      <input
        type="text"
        name="nazivSale"
        placeholder="Naziv sale"
        value={nazivSale}
        onChange={handleChange}
      />
      <input
        type="text"
        name="kapacitetSale"
        placeholder="Kapacitet sale"
        value={kapacitetSale}
        onChange={handleChange}
      />
      <button onClick={dodajSalu}>Dodaj salu</button>

      <h2>Sale</h2>
      {sale.map((sala) => (
        <div key={sala.id}>
          <p>Naziv: {sala.naziv}</p>
          <p>Kapacitet: {sala.kapacitet}</p>
          <button onClick={() => obrisiSalu(sala.id)}>Obriši</button>
        </div>
      ))}

      <h2>Dodaj projekciju</h2>
      <select name="projekcija" value={projekcija} onChange={handleChange}>
        <option value="">Izaberi film i salu</option>
        {filmovi.map((film) => (
          <option key={film.id} value={film.id}>
            {film.naziv}
          </option>
        ))}
      </select>
      <button onClick={dodajProjekciju}>Dodaj projekciju</button>

      <h2>Projekcije</h2>
      {projekcije.map((projekcija) => (
        <div key={projekcija.id}>
          <p>Film ID: {projekcija.filmId}</p>
          <p>Sala ID: {projekcija.salaId}</p>
          <button onClick={() => obrisiProjekciju(projekcija.id)}>Obriši</button>
        </div>
      ))}

      <h2>Dodaj rezervaciju</h2>
      <select name="rezervacija" value={projekcija} onChange={handleChange}>
        <option value="">Izaberi projekciju</option>
        {projekcije.map((projekcija) => (
          <option key={projekcija.id} value={projekcija.id}>
            {projekcija.id}
          </option>
        ))}
      </select>
      <input
        type="email"
        name="emailRezervacije"
        placeholder="Email za rezervaciju"
        value={emailRezervacije}
        onChange={handleChange}
      />
      <button onClick={dodajRezervaciju}>Dodaj rezervaciju</button>

      <h2>Rezervacije</h2>
      {rezervacije.map((rezervacija) => (
        <div key={rezervacija.id}>
          <p>Projekcija ID: {rezervacija.projekcijaId}</p>
          <p>Email: {rezervacija.email}</p>
          <button onClick={() => obrisiRezervaciju(rezervacija.id)}>Obriši</button>
        </div>
      ))}
    </div>
  );
}

export default App;
*/


///

/*
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [filmovi, setFilmovi] = useState([]);
  const [sale, setSale] = useState([]);
  const [projekcije, setProjekcije] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("./data.json");
      const data = response.data;
      setFilmovi(data.filmovi);
      setSale(data.sale);
      setProjekcije(data.projekcije);
      setRezervacije(data.rezervacije);
    } catch (error) {
      setError(error);
    }
  };

  if (error) {
    return <div>Greška prilikom dohvaćanja podataka: {error.message}</div>;
  }

  return (
    <div>
      <h2>Filmovi</h2>
      {filmovi.map((film) => (
        <div key={film.id}>
          <p>Naziv: {film.naziv}</p>
          <p>Tehnologija: {film.tehnologija}</p>
        </div>
      ))}

      <h2>Sale</h2>
      {sale.map((sala) => (
        <div key={sala.id}>
          <p>Naziv: {sala.naziv}</p>
          <p>Kapacitet: {sala.kapacitet}</p>
        </div>
      ))}

      <h2>Projekcije</h2>
      {projekcije.map((projekcija) => (
        <div key={projekcija.id}>
          <p>Film ID: {projekcija.filmId}</p>
          <p>Sala ID: {projekcija.salaId}</p>
          <p>Cena: {projekcija.cena}</p>
          <p>Datum i vreme: {projekcija.datumVreme}</p>
        </div>
      ))}

      <h2>Rezervacije</h2>
      {rezervacije.map((rezervacija) => (
        <div key={rezervacija.id}>
          <p>Projekcija ID: {rezervacija.projekcijaId}</p>
          <p>Email: {rezervacija.email}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
*/




//Json
/*
{
  "filmovi": [
    {
      "naziv": "Film 1",
      "is3D": false
    },
    {
      "naziv": "Film 2",
      "is3D": true
    }
  ],
  "sale": [
    {
      "id": 1,
      "naziv": "Sala 1",
      "kapacitet": 100
    },
    {
      "id": 2,
      "naziv": "Sala 2",
      "kapacitet": 80
    }
  ],
  "projekcije": [
    {
      "id": 1,
      "filmId": 1,
      "salaId": 1,
      "cena": 200,
      "datumVreme": "2023-06-09T18:00:00"
    },
    {
      "id": 2,
      "filmId": 2,
      "salaId": 2,
      "cena": 250,
      "datumVreme": "2023-06-10T20:00:00"
    }
  ],
  "rezervacije": [
    {
      "id": 1,
      "projekcijaId": 1,
      "email": "korisnik1@example.com"
    },
    {
      "id": 2,
      "projekcijaId": 2,
      "email": "korisnik2@example.com"
    }
  ]
}
*/