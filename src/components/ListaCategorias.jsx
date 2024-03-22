import { useEffect, useState } from 'react'
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const ListaCategorias = () => {
    const url = 'https://api.escuelajs.co/api/v1/categories';
    const [categorias, setCategorias] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const openModal = (operation, id, name, image) => {
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
            setImage(image);
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
        } else if (image === '') {
            alertaWarning('seleccione una imagen', 'image');
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

    const iniciotHandler = () => {
        navigate('/');
    }
    const getDatos = async () => {
        const response = await axios.get(url);
        setCategorias(response.data);
    }

    useEffect(() => {
        getDatos();
    });
    return (
        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
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
                                categorias.map((item) => (
                                    <tr key={item.id}>
                                        <td>{i + 1}</td>                                        
                                        <td>{item.name}</td>
                                        <td><img src={item.image}></img></td>
                                        <td>
                                            <button onClick={() => openModal(2, item.id, item.name,item.image)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-edit' />
                                            </button>
                                            <button onClick={() => deleteCategoria(item.id)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash' />
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

    );

}


export default ListaCategorias;
