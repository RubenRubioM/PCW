<?php
// FICHERO: rest/delete/combinacion.php
$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER DELETE. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'DELETE') exit();
// PETICIONES DELETE ADMITIDAS:
//   rest/combinacion/ -> borra la combinación cuya clave se envía como cabecera
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
require_once('../configbd.php');
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
// =================================================================================
// Se pillan las cabeceras de la petición y se comprueba que está la de autorización
// =================================================================================
$headers = apache_request_headers();
if(!isset($headers['Authorization']))
{ // Acceso no autorizado
    $RESPONSE_CODE = 401;
    $R = array('RESULTADO' => 'ERROR', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => 'Falta autorización');
    http_response_code($RESPONSE_CODE); // 401 - Unauthorized access
    print json_encode($R);
    exit();
}
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = []; // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
// =================================================================================
// Se borra la combinación (partida) de la BD
try{
    mysqli_query($link, 'BEGIN');
    $mysql = 'select * from partida where clave="' . $headers['Authorization'] . '"';
    if($res = mysqli_query($link, $mysql))
    {
        if(mysqli_num_rows($res) > 0)
        {
            $mysql = 'delete from partida where clave="' . $headers['Authorization'] . '"';
            if(mysqli_query($link, $mysql))
            {
                $RESPONSE_CODE = 200;
                $R = array('RESULTADO' => 'OK', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => 'Combinación ' . $headers['Authorization'] . ' borrada correctamente.');
            }
            else
            {
                $RESPONSE_CODE = 500;
                $R = array('RESULTADO' => 'ERROR', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => 'Se ha producido un error en el servidor.');
            }
        }
        else
        {
            $RESPONSE_CODE = 200;
            $R = array('RESULTADO' => 'OK', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => 'No hay ninguna combinación con esa clave(' . $headers['Authorization'] . ')');
        }
    }
    mysqli_query($link, 'COMMIT');
}catch(Exception $e){
    mysqli_query($link,'ROLLBACK');
}
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
mysqli_close($link);
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
try {
    // Here: everything went ok. So before returning JSON, you can setup HTTP status code too
    http_response_code($RESPONSE_CODE);
    print json_encode($R);
}
catch (SomeException $ex) {
    $rtn = array('RESULTADO' => 'ERROR', 'CODIGO' => '500', 'DESCRIPCION' => "Se ha producido un error al devolver los datos.");
    http_response_code(500);
    print json_encode($rtn);
}
?>
