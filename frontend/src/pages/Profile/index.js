import React, { useState, useEffect} from 'react';
import { Link, useHistory} from "react-router-dom";
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from "../../services/api";

import './style.css';
import appLogo from '../../assets/logo.svg';
export default function Profile(){

    const [incidents, setIncidents] = useState([]);
    const history = useHistory();
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response =>{
            setIncidents(response.data);
        })
    },[ongId]);

    async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter( incident => incident.id !=+ id));

        }catch(err){
            alert('Erro ao deletar caso, tente novamente.');
        }
    }


    async function handleLogout(){
       localStorage.clear();
       history.push('/');
    }


    return(
        <div className="profile-container">
            <header>
                <img src={appLogo} alt="Be the Hero"/>
                <span>Bem vinda, APAD</span>

                <Link className="button" to="/incidents/new">Cadastrar novo Caso </Link>
                <button onClick={handleLogout} className="button" type="button"><FiPower size={18} color="#e02041"/></button>
            </header>
            <h1>Casos Cadastrados</h1>
            <ul>
                { incidents.map( incident => (
                    <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO:</strong>                    
                    <p>{incident.description}</p>

                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
                    
                    <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                        <FiTrash2 size={20} />
                    </button>
                </li>
                ))}
          
            </ul>

        </div>
    );
}