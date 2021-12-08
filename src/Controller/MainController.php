<?php

namespace App\Controller;

use App\Repository\ApiRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{

    private ApiRepository $api;

    public function __construct(ApiRepository $api)
    {
        $this->api = $api;
    }

    #[Route('/', name: 'main')]
    public function index(): Response
    {
        return $this->render('components/main/index.html.twig', [
            'frtoday' => $this->api->getFranceToday(),
            'deptoday' => $this->api->getFranceDepToday(),
        ]);
    }
}
