<?php
header('Content-Type: application/json');

$dbHost = 'localhost';
$dbName = 'londoola_db';
$dbUser = 'londoola';
$dbPass = 'Password1!';

try {
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (\PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]));
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'read':
            try {
                $stmt = $pdo->query("SELECT id, name, model_number, serial_number, last_serviced, next_service, facility, facility_location, facility_contact FROM equipment");
                $equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($equipment);
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Error reading equipment: ' . $e->getMessage()]);
            }
            break;

        case 'create':
            if (isset($_POST['name'], $_POST['model_number'], $_POST['serial_number'], $_POST['last_serviced'], $_POST['next_service'], $_POST['facility'], $_POST['facility_location'], $_POST['facility_contact'])) {
                $name = $_POST['name'];
                $modelNumber = $_POST['model_number'];
                $serialNumber = $_POST['serial_number'];
                $lastServiced = $_POST['last_serviced'];
                $nextService = $_POST['next_service'];
                $facility = $_POST['facility'];
                $facilityLocation = $_POST['facility_location'];
                $facilityContact = $_POST['facility_contact'];
                try {
                    $stmt = $pdo->prepare("INSERT INTO equipment (name, model_number, serial_number, last_serviced, next_service, facility, facility_location, facility_contact) VALUES (:name, :model_number, :serial_number, :last_serviced, :next_service, :facility, :facility_location, :facility_contact)");
                    $stmt->execute([
                        'name' => $name,
                        'model_number' => $modelNumber,
                        'serial_number' => $serialNumber,
                        'last_serviced' => $lastServiced,
                        'next_service' => $nextService,
                        'facility' => $facility,
                        'facility_location' => $facilityLocation,
                        'facility_contact' => $facilityContact
                    ]);
                    echo json_encode(['status' => 'success', 'message' => 'Equipment created successfully']);
                } catch (PDOException $e) {
                    echo json_encode(['status' => 'error', 'message' => 'Error creating equipment: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields for equipment creation.']);
            }
            break;

        case 'delete':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                try {
                    $stmt = $pdo->prepare("DELETE FROM equipment WHERE id = :id");
                    $stmt->execute(['id' => $id]);
                    echo json_encode(['status' => 'success', 'message' => 'Equipment deleted successfully']);
                } catch (PDOException $e) {
                    echo json_encode(['status' => 'error', 'message' => 'Error deleting equipment: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No equipment ID provided for deletion.']);
            }
            break;
        case 'read_catalog':
            try {
                $stmt = $pdo->query("SELECT * FROM catalog");
                $catalogItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($catalogItems);
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Error reading catalog: ' . $e->getMessage()]);
            }
            break;
        default:
            echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
            break;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No action specified']);
}
?>