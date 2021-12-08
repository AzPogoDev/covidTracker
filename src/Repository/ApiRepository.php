<?php

namespace App\Repository;

use App\Entity\Api;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * @method Api|null find($id, $lockMode = null, $lockVersion = null)
 * @method Api|null findOneBy(array $criteria, array $orderBy = null)
 * @method Api[]    findAll()
 * @method Api[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ApiRepository extends ServiceEntityRepository
{
    private HttpClientInterface $client;

    private ParameterBagInterface $parameterBag;

    private $config;

    public function __construct(ManagerRegistry $registry, HttpClientInterface $client, ParameterBagInterface $parameterBag)
    {
        $this->client = $client;
        $this->config = $parameterBag->get('covidPath');
        parent::__construct($registry, Api::class);
    }

    public function makeRequest($url, bool $index)
    {
        $response = $this->client->request(
            'GET',
            $url
        );
        $statusCode = $response->getStatusCode();
        $contentType = $response->getHeaders()['content-type'][0];
        $content = $response->getContent();
        $content = $response->toArray();
        if ($index == true) {
            return $content;
        }
        return $content[0];
    }

    public function getPositifWeek()
    {
        $url = 'https://raw.githubusercontent.com/CovidTrackerFr/covidtracker-data/master/data/france/stats/objectif_deconfinement.json';
        return $this->makeRequest($url, true);
    }

    public function getFranceToday()
    {
        $url = $this->config['franceToday'];
        return $this->makeRequest($url, false);
    }

    public function getFranceDepToday()
    {
        $url = $this->config['depToday'];

        return $this->makeRequest($url, true);
    }

    public function getDepSingle($dep)
    {
        $url = sprintf('%s/%s', $this->config['depSingle'], $dep);
        return $this->makeRequest($url, false);
    }

    public function getFranceByDate($date): array
    {
        $url = sprintf('%s/%s', $this->config->get('franceDate'), $date);
        return $this->makeRequest($url);
    }

}
