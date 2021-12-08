<?php

namespace App\Controller;

use App\Repository\ApiRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StatsController extends AbstractController
{

    private ApiRepository $api;

    public function __construct(ApiRepository $api)
    {
        $this->api = $api;
    }

    #[Route('/stats/{id}', name: 'stats')]
    public function index($id): Response
    {
        $data = $this->api->getDepSingle($id);

        return $this->render('components/stats/index.html.twig', [
            'dep' => $data,
        ]);
    }

    #[Route('/departements', name: 'alldepartures')]
    public function dep(): Response
    {
        //Tous les departements

        $alldep = $this->api->getFranceDepToday();

        $dc = [];
        $sdep = [];

        foreach ($alldep as $dep) {
            $dc[] = $dep['dchosp'];
            $sdep[] = $dep['lib_dep'];
        };

        return $this->render('components/stats/departements.html.twig', [
            'nom' => json_encode($sdep),
            'deces' => json_encode($dc),
        ]);
    }

    #[Route('/statistiques', name: 'statistique')]
    public function statistiques(): Response
    {
        //Tous les departements
        $data = $this->api->getPositifWeek();

        return $this->render('components/stats/courbe.html.twig', [
            'labels' => json_encode($data['cas']['dates']),
            'data' => json_encode($data['cas']['values']),
            'adm_labels' => json_encode($data['adm_rea']['dates']),
            'adm_data' => json_encode($data['adm_rea']['values']),
        ]);
    }
}
