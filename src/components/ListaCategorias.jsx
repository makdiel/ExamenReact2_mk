import { useEffect, useState } from 'react'
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const ListaCategorias = () => {
    const url = 'https://api.escuelajs.co/api/v1/categories';
    const [categorias, setCategorias] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const openModal = (operation, id, name) => {
        setId('');
        setName('');
        setImage('');
        if (operation === 1) {
            setTitleModal('Registrar Producto');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Producto');
            setId(id);
            setName(name);

            setOperation(2);
        }
    }

    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        await axios(obj).then(() => {
            let mensaje;
            if (metodo === 'POST') {
                mensaje = 'Se guardó el producto';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó el producto';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó el producto';
            }
            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getDatos();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }
    const validar = () => {
        let payload;
        let metodo;
        let urlAxios;

        if (name === '') {
            alertaWarning('Escriba el nombre de la categoria', 'name');
        } else {
            payload = {
                name: name,
                image: ['https://c8.alamy.com/compes/r3yw81/el-icono-de-imagen-no-disponible-vector-plana-r3yw81.jpg']
            };

            if (operation === 1) {
                metodo = 'POST';
                urlAxios = 'https://api.escuelajs.co/api/v1/categories/';
            } else {
                metodo = 'PUT';
                urlAxios = `https://api.escuelajs.co/api/v1/categories/${id}`;
            }

            enviarSolicitud(urlAxios, metodo, payload);
        }
    }

    const deleteCategoria = (id) => {
        let urlDelete = `https://api.escuelajs.co/api/v1/categories/${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar el producto?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            alertaError(error);
            console.log(error);
        });
    }
    const getDatos = async () => {
        const response = await axios.get(url);
        setCategorias(response.data);
    }

    useEffect(() => {
        getDatos();
    });
    return (
        <div className='App'>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-striped table-dark'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Categoría</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    categorias.map((categorias,i) => (
                                        <tr key={categorias.id}>
                                            <td>{i + 1}</td>
                                            <td>{categorias.name}</td>
                                            <td><img src={categorias.image} className="img-thumbnail   rounded w-50"  alt='Aavatar' ></img></td>
                                            <td>
                                                <button onClick={() => openModal(2, categorias.id, categorias.name)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit' />Edit
                                                </button>
                                                <button onClick={() => deleteCategoria(categorias.id)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash' />Del
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{titleModal}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='cloase' />
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift' /></span>
                                <input type='text' id='name' className='form-control' placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>                           
                           
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign' /></span>
                                <input type='File' id='image' className='form-control' placeholder='image' value={image} onChange={(e) => setImage(e.target.value)} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk' /> Guardar
                            </button>
                            <button id='btnCerrarModal' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}


export default ListaCategorias;
