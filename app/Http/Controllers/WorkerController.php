<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use GrahamCampbell\DigitalOcean\Facades\DigitalOcean;
use Request;

class WorkerController extends Controller
{
  public function index() {
    $droplets = DigitalOcean::droplet()->getAll();
    $jsonarray = array();
    foreach($droplets as $droplet)
    {
      if($droplet->id == 6154797)
        continue;

      $jsonarray[] = array(
        'id' => $droplet->id,
        'name' => $droplet->name,
        'status' => $droplet->status,
        'ip' => $droplet->networks[1]->ipAddress,
        'created_at' => $droplet->createdAt
      );
    }
    return response()->json($jsonarray);
  }
  public function listByHostname() {
    $droplets = DigitalOcean::droplet()->getAll();
    $jsonarray = array();
    foreach($droplets as $droplet)
    {
      if($droplet->id == 6154797)
        continue;

      $jsonarray[] = $droplet->name;
    }
    return response()->json($jsonarray);
  }
  public function store() {
    //12762061
    $result = DigitalOcean::droplet()->create(
      'worker-'.str_random(4),
      'ams3',
      '512mb',
      12762061,
      false,
      false,
      true
    );
    return response()->json($result);
  }
  public function destroy($id) {
    $result = DigitalOcean::droplet()->delete($id);
    return response()->json($result);
  }
}
