import json

import pandas as pd

from slamd import create_app
from slamd.discovery.processing.add_targets_dto import DataWithTargetsDto, TargetDto
from slamd.discovery.processing.discovery_service import DiscoveryService
from slamd.discovery.processing.forms.upload_dataset_form import UploadDatasetForm
from slamd.discovery.processing.models.dataset import Dataset


def test_slamd_shows_discovery_page(client, monkeypatch):
    def mock_list_datasets():
        return [Dataset('first dataset'), Dataset('second dataset')]

    monkeypatch.setattr(DiscoveryService, 'list_datasets', mock_list_datasets)

    response = client.get('/materials/discovery')
    html = response.data.decode('utf-8')

    assert response.status_code == 200

    assert 'Material Discovery' in html
    assert 'CSV File Upload' in html

    assert 'All datasets' in html
    assert 'first dataset' in html
    assert 'second dataset' in html


def test_slamd_creates_new_dataset_when_saving_is_successful(client, monkeypatch):
    app = create_app('testing', with_session=False)

    def mock_save_dataset(submitted_form, submitted_file):
        return (True, None)

    with app.test_request_context('/materials/discovery'):
        monkeypatch.setattr(DiscoveryService, 'save_dataset', mock_save_dataset)
        form = UploadDatasetForm(dataset='test dataset')

        response = client.post('/materials/discovery', data=form.data)

    assert response.status_code == 302
    assert b'test dataset' not in response.data
    assert response.request.path == '/materials/discovery'


def test_slamd_runs_experiment_and_shows_result(client, monkeypatch):
    def mock_run_experiment(dataset_name, request):
        data = {'feature': [1, 2], 'prediction': [3, 4]}
        return pd.DataFrame.from_dict(data)

    monkeypatch.setattr(DiscoveryService, 'run_experiment', mock_run_experiment)

    response = client.post('/materials/discovery/test_dataset', data=b'{}')

    assert response.status_code == 200

    template = json.loads(response.data.decode('utf-8'))['template']
    assert '<table ' in template
    assert 'id="formulations_dataframe"' in template

    assert '<th>feature</th>' in template
    assert '<th>prediction</th>' in template

    assert '<td>1</td>' in template
    assert '<td>3</td>' in template

    assert '<td>2</td>' in template
    assert '<td>4</td>' in template


def test_slamd_directs_to_add_targets_page(client, monkeypatch):
    def mock_show_dataset_for_adding_targets(dataset_name):
        df_data = {'feature1': [1], 'feature2': [2]}
        all_dtos = [DataWithTargetsDto(0, 'feature1: 1, feature2: 2', [TargetDto(0, 'prediction', 11)])]
        return pd.DataFrame.from_dict(df_data), all_dtos, ['prediction']

    monkeypatch.setattr(DiscoveryService, 'show_dataset_for_adding_targets', mock_show_dataset_for_adding_targets)

    response = client.get('/materials/discovery/test_dataset/add_targets', data=b'{}')

    assert response.status_code == 200

    template = response.data.decode('utf-8')
    assert '<table ' in template
    assert 'id="formulations_dataframe"' in template

    assert '<th>feature1</th>' in template
    assert '<th>feature2</th>' in template

    assert '<td>1</td>' in template
    assert '<td>2</td>' in template

    assert 'feature1: 1, feature2: 2' in template
    assert 'prediction' in template
    assert '<input' in template
    assert 'target-1-1' in template
    assert '11' in template
