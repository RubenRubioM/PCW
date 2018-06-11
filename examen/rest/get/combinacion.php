<?php
// FICHERO: rest/get/combinacion.php
$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER GET. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'GET') exit();
// PETICIONES GET ADMITIDAS:
//   rest/combinacion/ -> devuelve la combinación correspondiente a la clave que se le pasa como cabecera.
//   rest/combinacion/nueva/ -> devuelve una nueva combinación aleatoria de colores
//   rest/combinacion/comprobar/{COMBINACION} -> comprueba la combinación indicada. Necesita recibir la clave de la partida como cabecera.
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
// CABECERAS DE LA PETICIÓN
$headers = apache_request_headers(); // Se pillan las cabeceras de la petición
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R             = [];  // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
// =================================================================================
// Función para obtener la cabecera de autorización
function getClave()
{
    global $headers;
    if(!isset($headers['Authorization']))
    {
        $RESPONSE_CODE = 401;
        $error         = 'Falta la clave de autorización';
        $R             = array('RESULTADO' => 'ERROR', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => $error);
        return false;
    }
    return $headers['Authorization'];
}
// =================================================================================
switch(array_shift($RECURSO))
{
    case 'nueva': // se pide crear una nueva partida
            $longitud    = 4;
            $combTexto   = '';
            $COMBINACION = [];
            if(is_numeric($longitud))
            {
                for($i=0; $i<sanatize($longitud); $i++)
                {
                    $mysql = 'select * from color order by rand() limit 1';
                    if($res = mysqli_query($link, $mysql))
                    {
                        $color         = mysqli_fetch_assoc($res);
                        $COMBINACION[] = $color;
                        $combTexto    .= $color['id'];
                        mysqli_free_result( $res );
                    }
                }
            }
            // se genera la clave hash
            $fechaHora = date('YmdHis', time());
            $key       = md5($combTexto . $fechaHora);
            // Se crea la partida en la BD:
            $mysql = 'insert into partida(clave,fecha,combinacion) values("' . $key . '","' . $fechaHora . '","' . $combTexto . '")';
            if(mysqli_query($link,$mysql))
            {
                // Se prepara la respuesta
                $R['RESULTADO']   = 'OK';
                $R['CODIGO']      = 200;
                $R['COMBINACION'] = $COMBINACION;
                $R['clave']       = $key;
            }
            else
            {
                $RESPONSE_CODE = 500;
                $error         = 'Se ha producido un error en el servidor.';
                $R             = array('RESULTADO' => 'ERROR', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => $error);
            }
        break;
    case 'comprobar': // se pide comprobar una combinación para una partida
            if($clave = getClave())
            {
                $combinacion = array_shift($RECURSO);
                $mysql = 'select * from partida where clave="' . $clave . '"';
                if( $res = mysqli_query($link, $mysql) )
                {
                    // Hay que comprobar los aciertos en su sitio y las aproximaciones
                    $row = mysqli_fetch_assoc( $res );
                    $combGanadora = str_split($row['combinacion']);
                    $combUsuario  = str_split($combinacion);
                    $enSuLugar    = [];
                    $fueraDeLugar = 0;
                    // Se comprueban aciertos en su lugar
                    for($i=0;$i<count($combUsuario);$i++)
                    {
                        if($combGanadora[$i] == $combUsuario[$i])
                            $enSuLugar[] = $i;
                    }
                    foreach ($enSuLugar as $pos) {
                        unset($combGanadora[$pos]);
                        unset($combUsuario[$pos]);
                    }
                    $enSuLugar = count($enSuLugar);
                    // Se comprueban aciertos fuera de lugar
                    foreach ($combUsuario as $valor) {
                        if(array_search($valor, $combGanadora) !== FALSE)
                            $fueraDeLugar++;
                    }
                    // Se prepara la respuesta
                    $R['RESULTADO']   = 'OK';
                    $R['CODIGO']      = 200;
                    $R['COMBINACION'] = str_split($combinacion);
                    $R['ACIERTOS']    = ['EL' => $enSuLugar, 'FL' => $fueraDeLugar];
                }
            }
        break;
    case '':
            if($clave = getClave())
            {
                $clave = $headers['Authorization']; // se pilla la clase de la partida para poder comprobar aciertos.
                $mysql = 'select * from partida where clave="' . $clave . '"';
                if($res = mysqli_query($link,$mysql))
                {
                    $row = mysqli_fetch_assoc( $res );
                    // Se prepara la respuesta
                    $R['RESULTADO']   = 'OK';
                    $R['CODIGO']      = 200;
                    $R['COMBINACION'] = $row['combinacion'];
                }
            }
        break;
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
    $RESPONSE_CODE = 500;
    $rtn = array('RESULTADO' => 'ERROR', 'CODIGO' => $RESPONSE_CODE, 'DESCRIPCION' => "Se ha producido un error al devolver los datos.");
    http_response_code($RESPONSE_CODE);
    print json_encode($rtn);
}
?>
