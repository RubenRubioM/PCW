<?php
// FICHERO: rest/get/color.php
$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER GET. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'GET') exit();
// PETICIONES GET ADMITIDAS:
//   rest/color/ -> devuelve la lista de colores en la BD
//   rest/color/{ID} -> devuelve toda la información del registro con el ID indicado
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
require_once('../configbd.php');
// =================================================================================
$RECURSO = explode("/", $_GET['prm']);
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R                   = [];  // Almacenará el resultado.
$RESPONSE_CODE       = 200; // código de respuesta por defecto: 200 - OK
$mysql               = '';  // para el SQL
// =================================================================================
if(strlen($_GET['prm']) < 1)
    $mysql  = 'select * from color order by id';
else
{
    $ID = array_shift($RECURSO);
    if(is_numeric($ID))
     // Se debe devolver la información del registro con el ID indicado
    	$mysql  = 'select * from color where id=' . sanatize($ID);
}
// =================================================================================
// SE HACE LA CONSULTA
// =================================================================================
if( strlen($mysql)>0 && count($R)==0 && $res = mysqli_query( $link, $mysql ) )
{
    $AA = array("RESULTADO" => "OK", "CODIGO" => 200);
    if( substr($mysql, 0, 6) == "select" )
    {
        while( $row = mysqli_fetch_assoc( $res ) )
            $R[] = $row;
        mysqli_free_result( $res );
    }
    else $R[] = $res;
    $R = array_merge( $AA, array("FILAS" => $R) );
}
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
mysqli_close($link);
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
try {
    http_response_code($RESPONSE_CODE);
    print json_encode($R);
}
catch (SomeException $ex) {
    $rtn = array("RESULTADO" => "ERROR", "CODIGO" => 500, "DESCRIPCION" => "Se ha producido un error al devolver los datos.");
    http_response_code(500);
    print json_encode($rtn);
}
?>