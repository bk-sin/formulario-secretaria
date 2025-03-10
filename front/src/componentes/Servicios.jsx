import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from 'react';
import { cargarServicio, traerServicios, borrarServicio, editarServicio } from "../redux/reducers/serviciosSlice"
import { useParams } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {FiEdit} from "react-icons/fi";
import Swal from 'sweetalert2'

export default function Servicios(){
    const borrar = <RiDeleteBin5Fill />
    const editar = <FiEdit />

    const params = useParams()
    const dispatch = useDispatch()
    const servicios = useSelector((state) => state.servicios.servicios);
    const [editServicio, setEditServicio]= useState(false)
    
    useEffect(() => {
        const fetchData = async () => {
            if (params) {
                dispatch(traerServicios(params.id));
            }
        };
        fetchData();
    }, [params, dispatch]);
    
    const descripcion = useRef()
    const editado = useRef()
    
    function handleNuevoServicio(e) {
        e.preventDefault();
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear().toString();
    
        const fechaFormateada = `${dia}/${mes}/${anio}`;
        dispatch(
            cargarServicio({
                id: params.id,
                body: {
                    titulo: "Servicio",
                    descripcion: descripcion.current.value,
                    fecha: fechaFormateada
                }
            })
        );
    }
    
    function handleEditarServicio(idServicio){
        dispatch(editarServicio({
            id: idServicio,
            body:{
                descripcion: editado.current.value
            }
        }));
    }
    function handleBorrarServicio(idServicio) {
        Swal.fire({
            title: '¿Seguro de que deseas borrar este servicio?',
            text: '¡Este cambio no se puede revertir!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#37BBED',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar servicio'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(
                borrarServicio({
                    idServicio: idServicio,
                    usuario: params.id
                })
                ).then(() => {
                    dispatch(traerServicios(params.id));
                    Swal.fire('¡Borrado!', 'Este servicio fue eliminado.', 'success');
                });
            }
        });
    }

    return(
        <div className='contenedor-usuario contenedor-usuario-admin'>
            <div className='card-servicios usuario-cont-admin' >
                <div className='cont-servicios'>
                    <div className='cont-servicio'>
                        <p className='titulo negrita titulo-servicios'>Servicios Adquiridos</p>
                        <div className="margen-servicios">
                            {servicios[0] ? 
                            servicios.map((servicio, index) => 
                                <div key={index} className="cont-serv-linea" >
                                    <div className="admin-servicio">
                                        {editServicio ? (
                                            <form className="editor" onSubmit={() => { handleEditarServicio(servicio._id) }}>
                                                <input
                                                ref={editado}
                                                className='input-editor'
                                                type="text"
                                                defaultValue={servicio.descripcion}
                                                onChange={(e) => { editado.current.value = e.target.value }}
                                                />
                                            </form>
                                        ) : (
                                            <div>
                                                <p>{servicio.descripcion}</p>
                                            </div>
                                        )} 
                                        <div className="iconos-edicion">
                                            <p>{servicio.fecha}</p>
                                            <div className="btn-cursor btn-edit"  onClick={() => {setEditServicio(!editServicio)}}>{editar} </div>
                                            <div onClick={() => handleBorrarServicio(servicio._id)} >{borrar}</div>
                                        </div>
                                        
                                    </div>
                                    <div className="linea"></div>
                                </div>
                            ):
                            <p>No tiene servicios adquiridos</p>}
                            
                            <form className='servicios' onSubmit={handleNuevoServicio}>
                                <input ref={descripcion} className="input-form" type="text" placeholder="Describir servicio"  />
                                <input type="submit" className=" btn-agregar " value="Agregar" /> 
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}